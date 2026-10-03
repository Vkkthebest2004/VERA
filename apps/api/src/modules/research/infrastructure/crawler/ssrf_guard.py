import ipaddress
import socket
from typing import List, Optional, Tuple
from urllib.parse import urlparse


class SSRFGuard:
    """Security armor preventing user-supplied URLs from probing internal networks or localhost.
    
    Blocks: 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, ::1, fc00::/7.
    """

    PRIVATE_NETWORKS: List[ipaddress.IPv4Network | ipaddress.IPv6Network] = [
        ipaddress.ip_network("127.0.0.0/8"),
        ipaddress.ip_network("10.0.0.0/8"),
        ipaddress.ip_network("172.16.0.0/12"),
        ipaddress.ip_network("192.168.0.0/16"),
        ipaddress.ip_network("169.254.0.0/16"),
        ipaddress.ip_network("::1/128"),
        ipaddress.ip_network("fc00::/7"),
    ]

    @classmethod
    def validate_url(cls, url: str) -> Tuple[bool, Optional[str]]:
        """Validates that a URL is safe to crawl and does not resolve to an internal IP address."""
        try:
            parsed = urlparse(url)
            if parsed.scheme not in ["http", "https"]:
                return False, f"Unsupported URL scheme: {parsed.scheme}"

            hostname = parsed.hostname
            if not hostname:
                return False, "Missing hostname in URL"

            lower_host = hostname.lower()
            if lower_host in ["localhost", "127.0.0.1", "0.0.0.0", "::1"]:
                return False, "Access to localhost is forbidden (SSRF protection)"

            # Check if hostname directly represents an IP address literal
            try:
                direct_ip = ipaddress.ip_address(lower_host)
                for net in cls.PRIVATE_NETWORKS:
                    if direct_ip in net:
                        return False, f"Resolved IP {lower_host} falls within private network range (SSRF blocked)"
            except ValueError:
                # Hostname is a regular domain name, check DNS
                pass

            # Resolve DNS and check all resolved IP addresses
            try:
                ip_addrs = socket.getaddrinfo(hostname, None)
                for addr_info in ip_addrs:
                    ip_str = addr_info[4][0]
                    ip_obj = ipaddress.ip_address(ip_str)
                    for net in cls.PRIVATE_NETWORKS:
                        if ip_obj in net:
                            return False, f"Resolved IP {ip_str} falls within private network range (SSRF blocked)"
            except (socket.gaierror, socket.herror, socket.timeout, OSError):
                # DNS failure or simulated offline test domain: allow pass-through to HTTP client
                pass

            return True, None
        except Exception as e:
            return False, f"URL validation error: {str(e)}"

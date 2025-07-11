resource "aws_security_group" "rum_video_streaming_sg" {
  vpc_id      = aws_vpc.rum_video_streaming_vpc.id

  tags = {
    Name = "${var.ec2_instance_name}-${random_string.rum_video_streaming_id.result}--sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "rum_video_streaming_ssh_ipv4" {
  security_group_id = aws_security_group.rum_video_streaming_sg.id
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
  cidr_ipv4         = var.my_public_ip_cidr
}

resource "aws_vpc_security_group_ingress_rule" "rum_video_streaming_http_ipv4" {
  security_group_id = aws_security_group.rum_video_streaming_sg.id
  from_port         = 8000
  to_port           = 8000
  ip_protocol       = "tcp"
  cidr_ipv4         = var.my_public_ip_cidr
}

resource "aws_vpc_security_group_ingress_rule" "rum_video_streaming_backend_http_ipv4" {
  security_group_id = aws_security_group.rum_video_streaming_sg.id
  from_port         = 3000
  to_port           = 3000
  ip_protocol       = "tcp"
  cidr_ipv4         = var.my_public_ip_cidr
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.rum_video_streaming_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv6" {
  security_group_id = aws_security_group.rum_video_streaming_sg.id
  cidr_ipv6         = "::/0"
  ip_protocol       = "-1"
}

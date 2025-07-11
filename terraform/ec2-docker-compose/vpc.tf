resource "aws_vpc" "rum_video_streaming_vpc" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.ec2_instance_name}--vpc"
  }
}

resource "aws_subnet" "rum_video_streaming_vpc_public_subnet" {
  vpc_id                  = aws_vpc.rum_video_streaming_vpc.id
  cidr_block              = var.subnet_cidr_block
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.ec2_instance_name}-${random_string.rum_video_streaming_id.result}--public-subnet"
  }
}

resource "aws_internet_gateway" "rum_video_streaming_igw" {
  vpc_id = aws_vpc.rum_video_streaming_vpc.id

  tags = {
    Name = "${var.ec2_instance_name}-${random_string.rum_video_streaming_id.result}--igw"
  }
}

resource "aws_route_table" "rum_video_streaming_public_route_tablw" {
  vpc_id = aws_vpc.rum_video_streaming_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.rum_video_streaming_igw.id
  }

  tags = {
    Name = "${var.ec2_instance_name}-${random_string.rum_video_streaming_id.result}--public-rt"
  }
}

resource "aws_route_table_association" "rum_video_streaming_vpc_public_subnet_association" {
  subnet_id      = aws_subnet.rum_video_streaming_vpc_public_subnet.id
  route_table_id = aws_route_table.rum_video_streaming_public_route_tablw.id
}

data "aws_availability_zones" "available" {
  state = "available"
}

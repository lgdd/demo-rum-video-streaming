output "instance_name" {
  value = "${var.ec2_instance_name}-${random_string.rum_video_streaming_id.result}"
}

output "ssh" {
  value = "ssh -i ~/.ssh/${var.ec2_key_name} ubuntu@${aws_instance.rum_video_streaming_ec2.public_ip}"
}

output "rum_video_streaming" {
  value = "http://${aws_instance.rum_video_streaming_ec2.public_dns}:8000"
}


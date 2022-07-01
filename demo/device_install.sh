#!/bin/bash
# Installs device.px as systemd service
cp /usr/share/doc/python3-bayeosdevice/demo/device.py /usr/bin
chmod +x /usr/bin/device.py
cp /usr/share/doc/python3-bayeosdevice/demo/device.service /etc/systemd/system
systemctl enable device.service


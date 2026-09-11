# RGBlink VUE PTZ

Proof-of-concept Companion module for the RGBlink VUE RGB30X-POE-TLY.

The action payloads come from the RGBlink Broadcast PTZ Camera manual. The public manual documents the camera VISCA command bytes and a default network control port of 3001, but the exact IP framing/transport still needs confirmation against the buyer's camera/API documentation.

For that reason **Dry run is enabled by default**. In dry-run mode the module builds the same action packets and exposes the latest packet in the `last_command_hex` variable without sending anything to the camera.

Before disabling dry-run, confirm the camera firmware expects raw VISCA UDP on the configured port. Live validation should be performed on a buyer-authorized test camera.

Implemented actions:

- pan/tilt in eight directions + stop
- HOME
- variable zoom tele/wide + stop
- variable manual focus near/far + stop
- autofocus/manual focus
- preset set/recall/clear
- exposure mode
- iris reset/up/down
- white balance mode
- backlight on/off
- red tally on/off
- green tally on/off


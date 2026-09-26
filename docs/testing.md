# Testing notes

## Offline checks

Run `npm test` from the repository root. These checks compare generated VISCA
bytes, reject invalid inputs, and exercise Companion action callbacks. They do
not connect to a camera or load the full Companion runtime.

## Live camera acceptance checklist

Use a camera you are authorized to control. Record the camera model, firmware,
IP control mode, port, and the manual or vendor instruction that confirms the
expected UDP framing. Keep the module in dry-run mode until those details are
confirmed; the `last_command_hex` variable shows the bytes it would send.

In a safe test position, validate each behavior separately:

1. Send `HOME`, then a short left movement followed by `Stop`. Confirm the
   camera stops promptly and does not continue moving after a network error.
2. Test low and high pan/tilt, zoom, and focus speeds. Confirm the movement
   direction and speed match the selected action.
3. Save and recall a noncritical preset; verify the correct slot is used.
4. Test exposure, iris, white balance, backlight, and tally with their current
   state recorded so the camera can be restored.
5. Test power only after the movement and transport checks, since turning the
   camera off can interrupt the validation session.

For each command, capture the selected action, generated hex, observed camera
behavior, and any acknowledgement or error. A successful UDP send only proves
that the host accepted the datagram; it does not prove the camera applied the
command. Report firmware-specific differences before using the module in a
live production setup.

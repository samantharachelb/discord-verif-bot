# Discord Verification Bot

This bot allows Discord server admins to automate their verification processes. 
Intended for use where the Discord server has an accompanying Facebook page.

## How it works

When the user joins the discord server, a profile will automatically be created and the user will be directed to a channel
where they can do the verification process. The user will add their age, link to their Facebook profile and/or name, and
the robot will check that against a list of bad actors that the server administrators do not want in their server.

## Privacy Notes

#### What this bot does:

- Stores bot interactions in an audit log. Audit logs are stored for an `x` number of days (defaults to 30, 
configurable by user)
- Stores the bare minimum information needed to automate the verification process.
- In the event that a user is banned from the server, all information will be stored in the blacklist.
- Database is not shared between bot instances. Each bot instance has its own database and it is only accessible by the
Server Administrators. Project Maintainers _**DO NOT**_ have access to any data
- Robot can be configured to collect telemetry data. Only Server Administrators will have access to that data.

#### What this bot doesn't do:

- This bot _**DOES NOT**_ collect any information into a central data repository. All Server Administrators are in control
of the data in the database. Project Maintainers _**DO NOT**_ have any access to this data.



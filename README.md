# ScreenPond

ScreenPond lets you make fractals and the 'droste effect'.
I made it for my video: 📺 **[Screens in Screens in Screens](https://youtu.be/Q4OIcwt8vcE)**

## Try it out!

You can try it at [screenpond.cool](https://screenpond.cool)<br>

Draw screens by clicking and dragging!<br>
Press the number keys to change colour.<br>
Press "C" to clear the screen.

## Running

To run locally...<br>
you need to run a local server because it uses javascript modules.<br>
(ie: you can't just open `index.html` like most of my other projects)<br>

I recommend getting [deno](https://deno.land)
and then installing `file_server` with this command:

```
deno install --allow-read --allow-net https://deno.land/std@0.142.0/http/file_server.ts
```

Then you can run this command to run a local server:

```
file_server
```

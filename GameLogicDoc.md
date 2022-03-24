# Game Logic

## Potential Issues

Orders are still valid even after a player leaves the game. I am not sure
whether or not this introduces an exploit, or how it affects zero-sumness.
Even without this aspect; the zero sumness of the game is questionable because
players are free to join and leave whenever, thus value can leave the table.
Such is the life of an online game.

## Known Issues

The way that orders are cancelled is not perfect. They are cancelled on discrete
time, because orders are stored corresponding to a millisecond. However, the
price adjustment in the main game loop happens in continuous time, as it runs
on the computer clock cycle. This issue can be remedied by only adjusting price
in the main loop based on how long the order has been placed, compared to now in
milliseconds. I am not implementing this solution right now becuase:

1. this solution will add processing time to main game loop
2. this issue averages out to be a non issue, as the average gain and loss from
this is still 0.
3. the prevalence of this issue decreases with increase in frame rate.

The way this currently works is light weight and works within any reasonable
tolerance of perfectly.

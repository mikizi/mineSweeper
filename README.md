This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).


## Mine Sweeper ##
* Rules of the game:
* Board should be of configurable width, height and mines number.
* Should display an indication of the number of remaining flags above the board.
* Click on cell reveals the value underneath it:
* If it is a mine, you lose.
* Otherwise, display the number of mines around the cell (or empty if there are no mines around)
* If there are no mines around the cell, reveal all cells around it and and all cells around any adjacent empty cell.
* Shift+Click puts or removes a flag on that cell. (and updates the number of remaining flags)
* Display alert if player tries to add a flag but he does not have any remaining flags.
* A flagged cell cannot be revealed (click does nothing) until the flag is removed.
* If all mines are flagged correctly, you win.
import React, {Component} from "react";
//import logo from './logo.svg';
import "./App.css";
import _ from "underscore";
import classNames from "classnames";

//let classNames = require('classnames');
//let _ = require('underscore');

const Header = () => {
    return (
        <div className="App-header">
            {/* <img src={logo} className="App-logo" alt="logo" />*/}
            <h2>Mine Sweeper</h2>
        </div>
    );
};

const Cell = (props) => {
    const location = props.cellData.location;
    const classes = ( location.x === 0) ? 'first cell' : ((location.x === (props.width - 1)) ? 'last cell' : 'cell');
    const isMined = props.cellData.value === '+' ? 'mine ' : ''; //glyphicon glyphicon-fire
    const isReveal = props.cellData.isRevealed ? 'show' : '';
    const cellClass = classes + ' ' + isMined + ' ' + isReveal;

    // console.log(location.x, location.y);
    return (
        <div data-x={location.x}
             data-y={location.y}
             data-val={props.cellData.value}
             id={props.id}
             className={cellClass}
             onClick={props.clickCell}
        >
            <span>{props.cellData.value}</span>
        </div>
    );
};

const Board = (props) => {
    let _this = this;

    _this.sortMap = {};

    return (
        <div className="row">
            <div className="Board" style={props.style}>
                {
                    props.boardData.map((row, y) => {
                        return row.map((col, x) => {
                            return (
                                <Cell key={x + '_' + y} cellData={col} id={x + '_' + y} width={props.width}
                                      clickCell={props.clickOnCell}/>
                            );
                        })
                    })

                }
            </div>
        </div>
    );
};

class Form extends Component {
    state = {
        width: 3,
        height: 3,
        mines: 1
    };

    handleSubmit = (event) => {
        event.preventDefault();
        //console.log(this);

        this.props.invoke(this.state)
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label className="inptLbl">Height:</label>
                <input type="number" value={this.state.height}
                       onChange={(event) => this.setState({height: event.target.value})} id="heightInpt" name="height"/>
                <label className="inptLbl">Width:</label>
                <input type="number" value={this.state.width}
                       onChange={(event) => this.setState({width: event.target.value})} id="widthInpt" name="width"/>
                <label className="inptLbl">Mines:</label>
                <input type="number" value={this.state.mines}
                       onChange={(event) => this.setState({mines: event.target.value})} id="minesInpt" name="mines"/>
                <input type="submit" value="Start Game"/>
            </form>
        );
    }
}

class Game extends Component {

    state = {
        sortMap: [],
        height: 0,
        width: 0,
        mines: 0,
        style: {}
    };

    initState = (formState) => {
        this.setState(() => ({
            width: formState.width,
            height: formState.height,
            mines: formState.mines,
            style: {
                height: 'auto',
                width: 50 * formState.width + 2 * formState.width + 'px',
                margin: '10px auto'
            }
        }), this.initGameState); //this.buildBoard
    };

    initGameState = () => {
        let sortMap = [];
        let _this = this;
        let mMap = this.mineMap();
        let buildMap = {};

        const arrayOfHeight = _.range(0, this.state.height);
        const arrayOfWidth = _.range(0, this.state.width);

        arrayOfHeight.forEach(function (itemH) {
            arrayOfWidth.forEach(function (itemW) {
                let value = 0;

                if (mMap[itemW + ',' + itemH]) {
                    value = '+';
                    buildMap = _this.updateClosest(buildMap, _this.state.width, _this.state.height, itemW, itemH);
                }

                if (!buildMap[itemW + "," + itemH] || value === '+') {
                    buildMap[itemW + "," + itemH] = {
                        location: {
                            x: itemW,
                            y: itemH
                        },
                        value: value,
                        isRevealed: false
                    };
                }
            });
        });

        for (let x = 0; x < this.state.height; x++) {
            for (let y = 0; y < this.state.width; y++) {
                let key = y + "," + x;

                if (sortMap[x] === undefined)
                    sortMap[x] = [];

                sortMap[x][y] = buildMap[key];
            }
        }

        this.setState(() => ({
            sortMap: sortMap,
        }));

    };

    mineMap = function () {

        let mineMap = {};
        let minesLeft = this.state.mines;
        while (minesLeft > 0) {
            const x = Math.floor(Math.random() * this.state.width);
            const y = Math.floor(Math.random() * this.state.height);
            if (!mineMap[x + "," + y]) {
                mineMap[x + "," + y] = {'x': x, 'y': y};
                minesLeft--;
            }
        }
        return mineMap;
    };

    updateClosest = function (grid, maxX, mxaY, thisPosX, thisPosY) {
        const startPosX = (thisPosX - 1 < 0) ? thisPosX : thisPosX - 1;
        const startPosY = (thisPosY - 1 < 0) ? thisPosY : thisPosY - 1;
        const endPosX = (thisPosX + 1 >= maxX) ? thisPosX : thisPosX + 1;
        const endPosY = (thisPosY + 1 >= mxaY) ? thisPosY : thisPosY + 1;

        // See how many are alive
        for (let rowNum = startPosX; rowNum <= endPosX; rowNum++) {
            for (let colNum = startPosY; colNum <= endPosY; colNum++) {
                if (!(rowNum === thisPosX && colNum === thisPosY)) { //if this is current pos then skip
                    if (grid[rowNum + ',' + colNum]) {
                        if (grid[rowNum + ',' + colNum].value !== '+') {
                            grid[rowNum + ',' + colNum].value++;
                        }
                    } else {
                        grid[rowNum + ',' + colNum] = {
                            location: {
                                x: rowNum,
                                y: colNum
                            },
                            value: 1,
                            isRevealed: false
                        };
                    }
                }
            }
        }
        return grid;
    };

    updateMap = (e) => {

        if (this.hasClass(e.target, 'mine')) {
            alert('you lose');
            this.setState(() => ({
                sortMap: [],
            }));
        } else {
            let arr = [...this.state.sortMap];
            let x = e.target.dataset.x;
            let y = e.target.dataset.y;
            if(e.target.dataset.x === undefined){
               let el = e.target.parentElement;
               x = el.dataset.x;
               y = el.dataset.y;
            }
            const cell = arr[y][x];

            if (!cell.isRevealed && e.target.dataset.val > 0) {
                cell.isRevealed = true;
            } else if (!cell.isRevealed && e.target.dataset.val === "0") {
                this.revealZeros(arr, y, x)
            }

            this.setState(() => ({
                sortMap: [...arr],
            }));

            //console.log(this.state.sortMap);
            //e.target.classList.add('show');
        }

        //console.log('click', e.target.dataset);
    };

    hasClass = function (element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    };

     revealZeros = (arr, row, col) => {
         row = parseInt(row);
         col = parseInt(col);

         console.log('start' ,row, col);
        if (arr[row] !== undefined && arr[row][col] !== undefined) {
            if (arr[row][col].value === 0 && !arr[row][col].isRevealed) {
                arr[row][col].isRevealed = true;
                console.log('in' , row, col);
                this.revealZeros(arr, row - 1, col - 1);
                this.revealZeros(arr, row, col - 1);
                this.revealZeros(arr, row + 1, col - 1);

                this.revealZeros(arr, row - 1, col);
                this.revealZeros(arr, row + 1, col);

                this.revealZeros(arr, row - 1, col + 1);
                this.revealZeros(arr, row, col + 1);
                this.revealZeros(arr, row + 1, col + 1);
            }
        }
    };

    render() {

        return (
            <div className="App">
                <Header/>
                <Form invoke={this.initState}/>
                <div className="board-wrp">
                    <Board
                        boardData={this.state.sortMap}
                        style={this.state.style}
                        clickOnCell={this.updateMap}
                    />
                </div>
            </div>
        );
    }
}

export default Game;

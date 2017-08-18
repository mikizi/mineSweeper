import React, {Component} from "react";
//import logo from './logo.svg';
import "./App.css";
import _ from "underscore";
import classNames from "classnames";

//let classNames = require('classnames');
//let _ = require('underscore');

const Header = (props) => {
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
    const isMined = props.cellData.value === '+' ? 'mine' : '';
    const cellClass = classNames(
        'cell-x-' + location.x,
        'cell-y-' + location.y,
        classes,
        isMined
    );

    console.log(location.x, location.y);
    return (
        <div data-x={location.x} data-y={location.y} key={props.id} className={cellClass} onClick={props.clickOnCell()}>
            {props.cellData.value}
        </div>
    );
};

const Board = (props) => {
    let _this = this;

    _this.sortMap = {};


    // let handleClick = function (e) {
    //     if (hasClass(e.target, 'mine')) {
    //         alert('you lose');
    //     } else {
    //         e.target.classList.add('show');
    //     }
    // };

    let showZeros = function (x, y) {
        if (x < 0 || x > props.width || y < 0 || y > props.width) {
            return;
        }
        if (_this.sortMap[x + '_' + y].value === 0) {

        }
    };

    return (
        <div className="row">
            <div className="Board" style={props.style}>
                {
                    Object.keys( props.boardData).map((key, index) =>
                        <Cell key={key} cellData={ props.boardData[key]} id={key} width={props.width}
                              clickOnCell={props.clickOnCell}/>
                    )
                }
            </div>
        </div>
    );
};

class Form extends Component {

    render() {
        return (
            <button onClick={this.props.invoke}> click me</button>
        );
    }
}

class Game extends Component {

    state = {
        sortMap: [],
        height: 5,
        width: 6,
        mines: 5,
        style: {}
    };

    arrayOfHeight = _.range(0, this.state.height);
    arrayOfWidth = _.range(0, this.state.width);

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

    updateMap = function(e){
        debugger;
        if(e) {
            if (this.hasClass(e.target, 'mine')) {
                alert('you lose');
            } else {
                e.target.classList.add('show');
            }

            console.log('click', e);
        }
    };

    hasClass = function (element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
};

    buildBoard = () => {
        let _this = this;
        let buildMap = {};
        let sortMap = [];
        let mMap = {};


        mMap = _this.mineMap();

        _this.arrayOfHeight.forEach(function (itemH) {
            _this.arrayOfWidth.forEach(function (itemW) {
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

        for (let y = 0; y < this.state.height; y++) {
            for (let x = 0; x < this.state.width; x++) {
                let key = x + "," + y;
                sortMap.push(buildMap[key]);
            }
        }

        this.setState(() => ({
            sortMap: sortMap
        }));

    };

    render() {

        this.state.style = {
            height: 'auto',
            width: 50 * this.state.width + 2 * this.state.width + 'px',
            margin: '10px auto'
        };

        return (
            <div className="App">
                <Header/>
                <Form invoke={this.buildBoard}/>
                <div className="board-wrp" >
                    <Board boardData={this.state.sortMap} style={this.state.style} clickOnCell={this.updateMap}/>
                </div>
            </div>
        );
    }
}

export default Game;

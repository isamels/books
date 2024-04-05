var n = 8; //# of books

let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

function draw(rect, n, shelf, place){
    rect.setAttribute("x", 7+place*2+"vw"); //place of book
    rect.setAttribute("y", 20-n*2+shelf*26+"vh"); //nth book height & shelf
    rect.setAttribute("width", "2vw"); //always 2
    rect.setAttribute("height", (n+1)*2+"vh"); //nth book height
    var col = 255-n*28;
    rect.setAttribute("fill", "rgb(" + col + ", " + col + ", " + col + ")");
    rect.setAttribute("stroke", "black");
    rect.setAttribute("stroke-width", "2");
    svg.appendChild(rect);
}

//initiate bookshelf arrays
var shelf1 = [];
var shelf2 = [];
var shelf3 = [];
var books1 = [];
var books2 = [];
var books3 = [];

//generate problem
function generate(n){
    var place = 0;
    for(var i = n; i > 0; i--){
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        place = Math.floor(Math.random() * 3);
        if(place == 0){
            //draw(rect, i, place, shelf1.length);
            books1.push(rect);
            shelf1.push(i);
        }else if(place == 1){
            //draw(rect, i, place, shelf2.length);
            books2.push(rect);
            shelf2.push(i);
        }else if(place == 2){
            //draw(rect, i, place, shelf3.length);
            books3.push(rect);
            shelf3.push(i);
        }
    }
}

generate(n);

while(books1.length == n || books2.length == n || books3.length == n){ //keep generating until starting state is not solved
    shelf1.length = 0;
    shelf2.length = 0;
    shelf3.length = 0;
    books1.length = 0;
    books2.length = 0;
    books3.length = 0;
    generate(n);
}

for(var i = 0; i < books1.length; i++){
    draw(books1[i], shelf1[i], 0, i);
}
for(var i = 0; i < books2.length; i++){
    draw(books2[i], shelf2[i], 1, i);
}
for(var i = 0; i < books3.length; i++){
    draw(books3[i], shelf3[i], 2, i);
}

document.body.appendChild(svg);
//----------------------------------------------------------------------------------------------------------------------------
//arrow key movement
var current = 0;
var hold = false;
var moves = 0;
var trackMoves = [];
var prev = 0; //shelf current book was taken from
var undoing = false;
var winned = false;

//select current bookshelf
function select(n){
    n++;
    var select = document.getElementById("shelf" + n);
    select.setAttribute("stroke-opacity", "1");
}

function unSelect(n){
    n++;
    var select = document.getElementById("shelf" + n);
    select.setAttribute("stroke-opacity", "0");
}

select(0);

//show moves
var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
var min = document.createElementNS("http://www.w3.org/2000/svg", "text");
var target = findSolution(shelf1, shelf2, shelf3);

min.setAttribute("x", "44vw");
min.setAttribute("y", "14vh");
min.setAttribute("font-size", "3vh");
min.setAttribute("font-family", "Righteous");
min.textContent = "Target: " + target;
svg.appendChild(min);

function showMoves(moves){
    text.setAttribute("x", "40vw");
    text.setAttribute("y", "10vh");
    text.setAttribute("font-size", "6vh");
    text.setAttribute("font-family", "Righteous");
    text.textContent = "Moves: " + moves;
    svg.appendChild(text);
}

showMoves(moves);

//arrow key movement
function moveUp(){
    if(current > 0){
        if(hold){
            if(current == 1){
                var book = books2[books2.length-1];
                books1.push(book);
                books2.pop();
            }else{
                var book = books3[books3.length-1];
                books2.push(book);
                books3.pop();
            }
            var y = parseInt(book.getAttribute("y").replace("vh","")) - 26;
            book.setAttribute("y", y + "vh");
        }
        unSelect(current);
        current--;
        select(current);
    }
}

function moveDown(){
    if(current < 2){
        if(hold){
            if(current == 0){
                var book = books1[books1.length-1];
                books2.push(book);
                books1.pop();
            }else{
                var book = books2[books2.length-1];
                books3.push(book);
                books2.pop();
            }
            var y = parseInt(book.getAttribute("y").replace("vh","")) + 26;
            book.setAttribute("y", y + "vh");
        }
        unSelect(current);
        current++;
        select(current);
    }
}

function moveRight(){
    if(!hold){
        if(current == 0){
            var book = books1[books1.length-1];
        }else if(current == 1){
            var book = books2[books2.length-1];
        }else{
            var book = books3[books3.length-1];
        }
        var x = 27;
        book.setAttribute("x", x + "vw");
        hold = true;
        prev = current;
    }
}

function moveLeft(){
    if(hold){
        if(current == 0){
            var book = books1[books1.length-1];
            if(books1.length > 1){
                var bookLeft = books1[books1.length-2];
            }else{
                var bookLeft = book;
            }
            var x = 7 + (books1.length*2-2);
        }else if(current == 1){
            var book = books2[books2.length-1];
            if(books2.length > 1){
                var bookLeft = books2[books2.length-2];
            }else{
                var bookLeft = book;
            }
            var x = 7 + (books2.length*2-2);
        }else{
            var book = books3[books3.length-1];
            if(books3.length > 1){
                var bookLeft = books3[books3.length-2];
            }else{
                var bookLeft = book;
            }
            var x = 7 + (books3.length*2-2);
        }
        //only if the book to the left is larger
        var height1 = parseInt(book.getAttribute("height").replace("vh",""));
        var height2 = parseInt(bookLeft.getAttribute("height").replace("vh",""));
        if(undoing){
            book.setAttribute("x", x + "vw");
        }else if(height1 <= height2){
            book.setAttribute("x", x + "vw");
            hold = false;
            moves++;
            showMoves(moves);
            trackMoves.push(prev + " " + current);
            //console.log(trackMoves);
            //you won!
            if(books1.length == n || books2.length == n || books3.length == n){
                win();
            }
        }
    }
}
function undo(){
    if(moves > 0){
        undoing = true;
        moves--;
        showMoves(moves);
        var recent = trackMoves[trackMoves.length-1];
        //console.log(recent);
        var a = parseInt(recent[0]);
        var b = parseInt(recent[2]);
        //console.log(hold);
        if(hold){
            while(current > prev){
                moveUp();
            }
            while(current < prev){
                moveDown();
            }
            moveLeft();
        }
        unSelect(current);
        current = b;
        select(current);
        hold = true;
        if(b < a){ //move down, move from b to a
            while(current < a){
                moveDown();
                moveLeft();
            }
        }else if(b > a){ //move up
            while(current > a){
                moveUp();
                moveLeft();
            }
        } //otherwise move on the spot
        hold = false;
        undoing = false;
        trackMoves.pop();
        //console.log(trackMoves);
    }
}

function win(){
    var winScreen = document.createElementNS("http://www.w3.org/2000/svg", "text");
    winScreen.setAttribute("x", "37vw");
    winScreen.setAttribute("y", "40vh");
    winScreen.setAttribute("font-size", "10vh");
    winScreen.setAttribute("font-family", "Righteous");
    winScreen.setAttribute("fill", "rgb(51, 102, 0)");
    if(moves == target){
        winScreen.textContent = "YIPPEE!";
    }else{
        winScreen.textContent = "you won!";
    }
    svg.appendChild(winScreen);
    document.onkeydown = null;
}

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38' || e.keyCode == '87') {
        moveUp();
    }else if (e.keyCode == '40' || e.keyCode == '83') {
        moveDown();
    }else if (e.keyCode == '37' || e.keyCode == '65') {
        moveLeft();
    }else if (e.keyCode == '39' || e.keyCode == '68') {
        moveRight();
    }else if (e.keyCode == '90' && e.ctrlKey){ //ctrl z
        undo();
    }/*else if(e.keyCode == '72'){
        console.log("hint");
        if(books3.includes(n)){
            hint(books1, books2, books3, n, 0, 1, 2);
        }
    }*/
}

document.body.appendChild(svg);

//solve function
function solve(a, b, c, m, moves){
    if(!c.includes(m)){
        if(m-1 > 0){
            if(a.includes(m-1)){
                moves = solve(a, c, b, m-1, moves);
            }else if(c.includes(m-1)){
                moves = solve(c, a, b, m-1, moves);
            }else if(b.includes(m-1)){
                if(a.includes(m-2)){
                    moves = solve(c, a, b, m-1, moves);
                }else{
                    moves = solve(a, c, b, m-1, moves);
                }
            }
        }
        c.push(a[a.length - 1]);
        a.pop();
        //console.log(a);
        //console.log(b);
        //console.log(c);
        //console.log("----------------");
        moves++;
    }
    if(m-1 > 0){
        if(c.includes(m) && a.includes(m-1)){
            moves = solve(a, b, c, m-1, moves);
        }else{
            moves = solve(b, a, c, m-1, moves);
        }
    }
    return moves;
}

function findSolution(a, b, c){
    if(c.includes(n)){ //stack3 is the goal
        if(b.includes(n-1)){ //start solving from n-1th stack, stack2 is the start
            return solve(b, a, c, n, 0);
        }else{ //stack1 or stack3 is the start
            return solve(a, b, c, n, 0);
        }
    }else if(b.includes(n)){ //stack2 is the goal
        if(c.includes(n-1)){ //stack3 is the start
            return solve(c, a, b, n, 0);
        }else{ //stack1 or stack2 is the start
            return solve(a, c, b, n, 0);
        }
    }else{ //stack1 is the goal
        if(c.includes(n-1)){ //stack3 is the start
            return solve(c, b, a, n, 0);
        }else{ //stack2 or stack1 is the start
            return solve(b, c, a, n, 0);
        }
    }
}

/*
function hint(a, b, c, m, x, y, z){
    let nextMove = null;
    if(!c.includes(m)){
        if(m-1 > 0){
            if(a.includes(m-1)){
                solve(a, c, b, m-1, x, z, y);
            }else if(c.includes(m-1)){
                solve(c, a, b, m-1, z, x, y);
            }else if(b.includes(m-1)){
                if(a.includes(m-2)){
                    solve(c, a, b, m-1, z, x, y);
                }else{
                    solve(a, c, b, m-1, x, z, y);
                }
            }
        }

        moves++;
        showMoves(moves);
        if(hold){
            while(current > prev){
                moveUp();
            }
            while(current < prev){
                moveDown();
            }
            moveLeft();
        }
        unSelect(current);
        current = b;
        select(current);
        hold = true;
        if(x < z){ //move down
            while(current < z){
                moveDown();
                moveLeft();
            }
        }else if(x > z){ //move up
            while(current > z){
                moveUp();
                moveLeft();
            }
        }
        hold = false;

    }
    if(m-1 > 0){
        if(c.includes(m) && a.includes(m-1)){
            solve(a, b, c, m-1, nextMove, x, y, z);
        }else{
            solve(b, a, c, m-1, nextMove, y, x, z);
        }
    }
    return;
}
*/
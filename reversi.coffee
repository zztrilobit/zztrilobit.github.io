class Cell
    constructor: (@y, @x, @td) ->
        @state=0
    getState: -> return @state
    setState: (state) -> 
        @state=state
        @display()
    roll: () ->
        switch @state
            when 1 then @state=2
            when 2 then @state=1
        @display()
    display: () ->
        switch @state
            when 0 then @td.html(' ')
            when 1 then @td.html('<b>X</b>')
            when 2 then @td.html('<b>O</b>')

class ReversiBoard
    constructor: (fs)->
        @field_size = fs
        @field=([1..@field_size+1] for i in [1..@field_size+1])
        @init()
        
    init:() ->
        for i in [1..@field_size] 
            for j in [1..@field_size]
                @field[i][j]=0
                
        n=@field_size/2
        @field[n][n]=1
        @field[n+1][n+1]=1
        @field[n][n+1]=2
        @field[n+1][n]=2
        
    clone:() ->
        res= new ReversiBoard(@field_size)
        for i in [1..@field_size] 
            for j in [1..@field_size]
                res.field[i][j]=@field[i][j]
        
    roll: (y,x) ->
        switch @field[y][x]
            when 1 then n=2
            when 2 then n=1
            else 0
        @field[y][x]=n

    getFlips: (y,x,p) ->
        if @field[y][x]!=0 
            return []
        
        dirs=[]
        a2= (x,y) -> return [x,y]
        flips=[]
        
        for i in [-1,0,1]
            for j in [-1,0,1]
                if (i!=0) || (j!=0) then dirs.push a2(i,j)
        
        #цикл по направлениям
        for dir in dirs
            dy=dir[0]
            dx=dir[1]
            nx=x+dx
            ny=y+dy
            
            #идем по направлению по своим фишкам
            temp=[]
            while (nx>=1) and (nx<=@field_size) and (ny>=1) and (ny<=@field_size) and (@field[ny][nx]!=0) and (@field[ny][nx]!=p)
                temp.push ((y:ny,x:nx))
                nx=nx+dx
                ny=ny+dy
                
            #и если уперлись в чужую ссыплем в ответ    
            if (nx>=1) and (nx<=@field_size) and (ny>=1) and (ny<=@field_size) and (@field[ny][nx]==p)
                for t in temp
                    flip=(y:t.y,x:t.x)
                    flips.push flip
        return  flips
        
    apply: (flips) ->
        for flip in flips 
            @roll(flip.y,flip.x)

    score: () ->
        scoreX=0
        scoreY=0
        for i in [1..@field_size] 
            for j in [1..@field_size]
                scoreX++ if @field[i][j]=1
                scoreO++ if @field[i][j]=2
        return (sx:scoreX,so:scoreO)
        
    possibleMoves: (side) ->
        tmpflips=[]
        foundflips=[]
        found_y=0
        found_x=0
        moves=[]
        for i in [1..@field_size] 
            for j in [1..@field_size]
                tmpflips=@getFlips(i,j,side)
                if tmpflips.length>0
                    foundflips=[]
                    found_y=i
                    found_x=j
                    moves.push((y:found_y, x:found_x, flips:tmpflips))
        
        return moves
        
        setState(i,j,p):->@field[i][j]=p
        
class Reversi2
    constructor:()->

    clicker: (i,j) -> return (event) => @onCellClick(i,j)

    
    onCellClick: (i,j) ->
        flips = @rb.getFlips(i,j,1)
        if flips.length>0
            @rb.setState(i,j,1)
            @rb.apply(flips)
        else 
            r=@rb.possibleMoves(1)
            if r.flips.length>0 
                alert "Ход неверен, есть возможность правильного хода"
                return
        myMove=(1==1)
        done=(1==0)
        @calc()
        r=@findAnyMove(2)
        while myMove and (not done) 
            if r.flips.length>0
                @field[r.y][r.x].setState(2)
                @roll(r.flips)
                
            r=@findAnyMove(1)
            if r.flips.length>0
                myMove=(1==0)
            else
                r=@findAnyMove(2)
                done=(r.flips.length == 0)
        @calc()
        alert("Game over!") if done
        
        return

    findAnyMove: (side) ->
        tmpflips=[]
        foundflips=[]
        found_y=0
        found_x=0
        pm=@rb.possibleMoves(side)
        
        for m in pm
            if m.flips.length>tmpflips.length
               
        for i in [1..@field_size] 
            for j in [1..@field_size]
                tmpflips=@getFlips(i,j,side)
                if tmpflips.length>foundflips.length
                    #alert(tmpflips)
                    foundflips=[]
                    found_y=i
                    found_x=j
                    for t in tmpflips 
                        foundflips.push(t)
        result=
            x:found_x
            y:found_y
            flips:foundflips
        return result

    init: () -> 
        ctrldiv=$('<div></div>')
        btn_init=$('<button>Init</button>').appendTo(ctrldiv)
        $('<p></p>').appendTo(ctrldiv)
        $('<span>X:</span>').appendTo(ctrldiv)
        @spanX=$('<span></span>').appendTo(ctrldiv)
        $('<p></p>').appendTo(ctrldiv)
        $('<span>O:</span>').appendTo(ctrldiv)
        @spanO=$('<span></span>').appendTo(ctrldiv)
        $('<p></p>').appendTo(ctrldiv)
        btn_init.click ()=>@initField()
        
        ctrldiv.appendTo($("#root"))
        tbl=$('<table></table>')
        tbl.appendTo($("#root"))
        @field_size = 8
        @field=([1..@field_size+1] for i in [1..@field_size+1])
        @rb=new ReversiBoard(@field_size)
        for i in [1..@field_size] 
            row=$('<row></row>')
            for j in [1..@field_size]
                cell=$('<td valign="middle" align="center" width=40 height=40></td>')
                cell.appendTo(row)
                @field[i][j]=cell
                
                cell.click @clicker(i,j)
            tbl.append(row)
        @initField()
    
########################################################			
class Reversi
    constructor: () ->
    roll: (flips) ->
        for flip in flips
            @field[flip[0]][flip[1]].roll()
    
    onCellClick: (i,j) ->
        flips = @getFlips(i,j,1)
        if flips.length>0
            @field[i][j].setState(1)
            @roll(flips)
        else 
            r=@findAnyMove(1)
            if r.flips.length>0 
                alert "Ход неверен, есть возможность правильного хода"
                return
        myMove=(1==1)
        done=(1==0)
        @calc()
        r=@findAnyMove(2)
        while myMove and (not done) 
            if r.flips.length>0
                @field[r.y][r.x].setState(2)
                @roll(r.flips)
                
            r=@findAnyMove(1)
            if r.flips.length>0
                myMove=(1==0)
            else
                r=@findAnyMove(2)
                done=(r.flips.length == 0)
        @calc()
        alert("Game over!") if done
        
        return
        
    clicker: (i,j) -> return (event) => @onCellClick(i,j)
    
    findAnyMove: (side) ->
        tmpflips=[]
        foundflips=[]
        found_y=0
        found_x=0
        for i in [1..@field_size] 
            for j in [1..@field_size]
                tmpflips=@getFlips(i,j,side)
                if tmpflips.length>foundflips.length
                    #alert(tmpflips)
                    foundflips=[]
                    found_y=i
                    found_x=j
                    for t in tmpflips 
                        foundflips.push(t)
        result=
            x:found_x
            y:found_y
            flips:foundflips
        return result
    
    getFlips: (y,x,p) ->
        if @field[y][x].state!=0 
            return []
        
        dirs=[]
        a2= (x,y) -> return [x,y]
        flips=[]
        
        for i in [-1,0,1]
            for j in [-1,0,1]
                if (i!=0) || (j!=0) then dirs.push a2(i,j)
        
        #цикл по направлениям
        for dir in dirs
            dy=dir[0]
            dx=dir[1]
            nx=x+dx
            ny=y+dy
            
            #идем по направлению по своим фишкам
            temp=[]
            while (nx>=1) and (nx<=@field_size) and (ny>=1) and (ny<=@field_size) and (@field[ny][nx].state!=0) and (@field[ny][nx].state!=p)
                temp.push a2(ny,nx)
                nx=nx+dx
                ny=ny+dy
                
            #и если уперлись в чужую ссыплем в ответ    
            if (nx>=1) and (nx<=@field_size) and (ny>=1) and (ny<=@field_size) and (@field[ny][nx].state==p)
                for t in temp 
                    flips.push(a2(t[0],t[1]))
        return  flips
        
        
    init: () -> 
        ctrldiv=$('<div></div>')
        btn_init=$('<button>Init</button>').appendTo(ctrldiv)
        $('<p></p>').appendTo(ctrldiv)
        $('<span>X:</span>').appendTo(ctrldiv)
        @spanX=$('<span></span>').appendTo(ctrldiv)
        $('<p></p>').appendTo(ctrldiv)
        $('<span>O:</span>').appendTo(ctrldiv)
        @spanO=$('<span></span>').appendTo(ctrldiv)
        $('<p></p>').appendTo(ctrldiv)
        btn_init.click ()=>@initField()
        
        ctrldiv.appendTo($("#root"))
        tbl=$('<table></table>')
        tbl.appendTo($("#root"))
        @field_size = 8
        @field=([1..@field_size+1] for i in [1..@field_size+1])
        for i in [1..@field_size] 
            row=$('<row></row>')
            for j in [1..@field_size]
                cell=$('<td valign="middle" align="center" width=40 height=40></td>')
                cell.appendTo(row)
                cc = new Cell(i,j,cell)
                cc.setState(0)				
                @field[i][j]=cc
                
                cell.click @clicker(i,j)
            tbl.append(row)
        @initField()
    
    calc: () ->
        scoreX=0
        scoreO=0
        for i in [1..@field_size] 
            for j in [1..@field_size]
                scoreX++ if @field[i][j].state==1
                scoreO++ if @field[i][j].state==2
        @spanX.html(scoreX)
        @spanO.html(scoreO)
        
    initField: () ->
        for i in [1..@field_size] 
            for j in [1..@field_size]
                @field[i][j].setState(0)
        n=@field_size/2
        @field[n][n].setState(1)
        @field[n+1][n+1].setState(1)
        @field[n+1][n+1].setState(1)
        @field[n][n+1].setState(2)
        @field[n+1][n].setState(2)
        @calc()

reversi= new Reversi
window.g_reversi = reversi

$(document).ready () -> reversi.init()
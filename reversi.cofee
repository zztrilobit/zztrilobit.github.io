
class ReversiBoard
    constructor: (fs)->
        @field_size = fs
        @field=([1..@field_size+1] for i in [1..@field_size+1])
        @init()
    
    maxscore:() -> return @field_size*@field_size+20
    
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
        @fill res
        return res
        
    fill: (dest) ->
        for i in [1..@field_size] 
            for j in [1..@field_size]
                dest.field[i][j]=@field[i][j]
        
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
        scoreO=0
        for i in [1..@field_size] 
            for j in [1..@field_size]
                scoreX++ if @field[i][j]==1
                scoreO++ if @field[i][j]==2
        return (sx:scoreX,so:scoreO)
    
    score_side: (s) ->
        score=0
        for i in [1..@field_size] 
            for j in [1..@field_size]
                score++ if @field[i][j]==s
        
        return score

    delta_side: (s) ->
        if s==1 
            opp=2
        else
            opp=1
        return @score_side(s)-@score_side(opp)
    
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
    
    setState: (i,j,p)->@field[i][j]=p
    getState: (i,j,p)->return @field[i][j]


    
#==========================================================================
# тупо жадный алгоритм - переверни побольше
class SimpleAlg
    findAnyMove: (board,side) ->
        opp= if side==1 then 2 else 1
        tmpflips=[]
        foundflips=[]
        found_y=0
        found_x=0
        pm=board.possibleMoves(side)
        
        for m in pm
            if m.flips.length>foundflips.length
                foundflips=[]
                found_y=m.y
                found_x=m.x
                for t in m.flips 
                    foundflips.push(t)
               
        result=
            x:found_x
            y:found_y
            flips:foundflips
        return result


getRandomInt= (mn,mx)->return Math.floor(Math.random() * ( mx - mn + 1 )) + mn
getRandomA= (a)->return a[getRandomInt(0,a.length-1)]         
        
#==========================================================================
# осторожный алгоритм - не дает после себя съесть много
class ConservAlg
    bestMoves: (board,side) ->
        opp= if side==1 then 2 else 1
        pm=board.possibleMoves(side)
        b = new ReversiBoard(board.field_size)
        b2 = new ReversiBoard(board.field_size)
        cost=1
        for m in pm
            board.fill(b)
            b.apply(m.flips)
            #возможные ответы оппонента на мой ход
            pm2=b.possibleMoves(opp)
            maxopp=0
            #ищем сколько он может максимально перевернуть
            for m2 in pm2
                maxopp=m2.flips.length if maxopp<m2.flips.length
            # рейтинг хода мои перевороты - макс его 
            m.rate=m.flips.length-maxopp
            
        maxrate=-board.maxscore()
        for m in pm
            if m.rate>maxrate
                maxrate=m.rate 
        tmp=[]
        for m in pm
            if m.rate==maxrate
                tmp.push(m)
        return tmp

    findAnyMove: (board,side) ->
        return getRandomA(@bestMoves(board,side))
        
class ContrAlg
    constructor:(pa)->
        @preAlg=pa
        
    bestMoves: (board,side) ->
        opp= if side==1 then 2 else 1
        pm=board.possibleMoves(side)
        b = new ReversiBoard(board.field_size)
        #b2 = new ReversiBoard(board.field_size)
        cost=1
        for m in pm
            board.fill(b)
            b.apply(m.flips)
            a=@preAlg.findAnyMove(board,opp)
            m.rate=m.flips.length-a.rate
            
        maxrate=-board.maxscore()
        for m in pm
            if m.rate>maxrate
                maxrate=m.rate 
        tmp=[]
        for m in pm
            if m.rate==maxrate
                tmp.push(m)
        return tmp
        
    findAnyMove: (board,side) ->
        return getRandomA(@bestMoves(board,side))

class MonteAlg 
    bestMoves: (board,side) ->
        opp= if side==1 then 2 else 1
        pm=board.possibleMoves(side)
        b = new ReversiBoard(board.field_size)
        b2 = new ReversiBoard(board.field_size)
        cost=1
        for m in pm
            board.fill(b)
            b.apply(m.flips)
            rate=0
            for i in [1..1000]
                gameOver=(1==0)
                n=0
                while ( not gameOver ) and ( n < ( board.field_size * board.field_size + 10 ) )
                    gameOver=(1==1) 
                    n++
                    rpm=b.possibleMoves(opp)
                    if rpm.length>0
                        gameOver=(1==0)
                        rm=getRandomA(rpm)
                        b.setState(rm.y,rm.x,opp)
                        b.apply(rm.flips)
                    rpm=b.possibleMoves(side)
                    if rpm.length>0
                        gameOver=(1==0)
                        rm=getRandomA(rpm)
                        b.setState(rm.y,rm.x,side)
                        b.apply(rm.flips)
                rate++ if b.score_side(side)>=b.score_side(opp)
            m.rate=rate;
        maxrate=0
        for m in pm
            if m.rate>maxrate
                maxrate=m.rate 
        tmp=[]
        for m in pm
            if m.rate==maxrate
                tmp.push(m)
        return tmp
        
    findAnyMove: (board,side) ->
        return getRandomA(@bestMoves(board,side))
    
#==========================================================================
class Reversi2
    constructor:()->
        @calg=new ConservAlg()
#        @alg=new ContrAlg(@calg)
        @alg=new MonteAlg(@calg)
        
    clicker: (i,j) -> return (event) => @onCellClick(i,j)

    
    onCellClick: (i,j) ->
        flips = @rb.getFlips(i,j,1)
        if flips.length>0
            @rb.setState(i,j,1)
            @rb.apply(flips)
        else 
            r=@rb.possibleMoves(1)
            if r.length>0 
                alert "Ход неверен, есть возможность правильного хода"
                return
        myMove=(1==1)
        done=(1==0)
        @draw()
        r=@findAnyMove(2)
        while myMove and (not done) 
            if r.flips.length>0
                @rb.setState(r.y,r.x,2)
                @rb.apply(r.flips)
                
            r=@findAnyMove(1)
            if r.flips.length>0
                myMove=(1==0)
            else
                r=@findAnyMove(2)
                done=(r.flips.length == 0)
        @draw()
        alert("Game over!") if done
        
        return

    findAnyMove: (side) ->
        return @alg.findAnyMove(@rb,side)

    calc: () ->
        s=@rb.score()
        @spanX.html(s.sx)
        @spanO.html(s.so)

    draw: () ->
        @calc()
        for i in [1..@field_size] 
            for j in [1..@field_size]
                switch @rb.getState(i,j)
                    when 0 then @field[i][j].html(' ')
                    when 1 then @field[i][j].html('<b>X</b>')
                    when 2 then @field[i][j].html('<b>O</b>')
        
        
    init: () -> 
        ctrldiv=$('<div></div>')
        
        btn_init=$('<button>Greedy</button>').appendTo(ctrldiv)
        btn_init.click ()=>@initFieldGreegy()
        
        btn_init=$('<button>Conserv</button>').appendTo(ctrldiv)
        btn_init.click ()=>@initFieldConserv()

        btn_init=$('<button>Cons++++</button>').appendTo(ctrldiv)
        btn_init.click ()=>@initFieldConserv2()
        
        btn_init=$('<button>Monte</button>').appendTo(ctrldiv)
        btn_init.click ()=>@initFieldMonte()
        
        $('<p></p>').appendTo(ctrldiv)
        $('<span>X:</span>').appendTo(ctrldiv)
        @spanX=$('<span></span>').appendTo(ctrldiv)
        $('<p></p>').appendTo(ctrldiv)
        $('<span>O:</span>').appendTo(ctrldiv)
        @spanO=$('<span></span>').appendTo(ctrldiv)
        $('<p></p>').appendTo(ctrldiv)
        
        ctrldiv.appendTo($("#root"))
        tbl=$('<table></table>')
        tbl.appendTo($("#root"))
        @field_size = 8
        @field=([1..@field_size+1] for i in [1..@field_size+1])
        @rb=new ReversiBoard(@field_size)
        for i in [1..@field_size] 
            row=$('<tr></tr>')
            for j in [1..@field_size]
                cell=$('<td valign="middle" align="center" width=40 height=40></td>')
                cell.appendTo(row)
                @field[i][j]=cell
                
                cell.click @clicker(i,j)
            tbl.append(row)
        @initField()
        
    initFieldGreedy:()->
        @alg=new SimpleAlg()
        @initField()
        
    initFieldConserv:()->
        @alg=new ConservAlg()
        @initField()
        
    initFieldConserv2:()->
        @calg=new ConservAlg()
        @alg=new MonteAlg(@calg)
        @initField()
        
    initFieldMonte:()->
        @alg=new MonteAlg()
        @initField()
    

    initField:()->
        @rb.init()
        @draw()

reversi= new Reversi2
window.g_reversi = reversi

$(document).ready () -> reversi.init()
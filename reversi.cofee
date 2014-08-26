
class ReversiBoard
    constructor: (fs)->
        @field_size = fs
        @field=([1..@field_size+1] for i in [1..@field_size+1])
        @dirs=[]
        for i in [-1,0,1]
            for j in [-1,0,1]
                if (i!=0) || (j!=0) then @dirs.push [i,j]

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
        opp= if p==1 then 2 else 1
        a2= (x,y) -> return [x,y]
        flips=[]
                
        #цикл по направлениям
        for dir in @dirs
            dy=dir[0]
            dx=dir[1]
            nx=x+dx
            ny=y+dy
            
            #идем по направлению по своим фишкам
            temp=[]
            while (nx>=1) and (nx<=@field_size) and (ny>=1) and (ny<=@field_size) and (@field[ny][nx]==opp)
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

    do_move: (m,side) ->
        @field[m.y][m.x]=side
        for flip in m.flips
            @field[flip.y][flip.x]=side
            #@roll(flip.y,flip.x)

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
    
    gameOver: () ->
        for i in [1..@field_size] 
            for j in [1..@field_size]
                tmpflips=@getFlips(i,j,1)
                if tmpflips.length>0 then return 1==0
                tmpflips=@getFlips(i,j,2)
                if tmpflips.length>0 then return 1==0
        return 1==1
        
    possibleMoves: (side) ->
        tmpflips=[]
        moves=[]
        for i in [1..@field_size] 
            for j in [1..@field_size]
                tmpflips=@getFlips(i,j,side)
                if tmpflips.length>0
                    moves.push((y:i, x:j, flips:tmpflips))        
        return moves
    
    isCorner: (j,i)->(j==1 or j==@field_size) and (i==1 or i==@field_size) 
    
    isPreCorner: (j,i)->
        res=(1==2)
        if (j==2 or j==@field_size-1) and ( i==1 or i==2 or i==@field_size or i==@field_size-1 ) 
            res=(1==1) 
        if (i==2 or i==@field_size-1) and ( j==1 or j==2 or j==@field_size or j==@field_size-1 )
            res=(1==1) 
        return res

    setState: (i,j,p)->@field[i][j]=p
    getState: (i,j,p)->return @field[i][j]
    opp: (side) -> return if side==1 then 2 else 1


    
#==========================================================================
# тупо жадный алгоритм - переверни побольше
class RandomAlg
    findAnyMove: (board,side) ->
        pm=board.possibleMoves(side)
        return getRandomA(pm)

class SimpleAlg
    moveRate: (m) ->
        res=m.flips.length
        if @board.isCorner(m.y,m.x)
            res=res+10
        if @board.isPreCorner(m.y,m.x)
            res=res-10
        return res
    findAnyMove: (board,side) ->
        @board=board
        opp= board.opp(side)
        pm=board.possibleMoves(side)
        maxrate=(-board.maxscore())*2
        tmp=[]
        for m in pm
            r=@moveRate(m)
            if r=maxrate
                tmp.push m
            if r>maxrate
                tmp=[]
                tmp.push m
                maxrate=r
                res=m
                res.rate=r
        return getRandomM(tmp)


getRandomInt= (mn,mx)->return Math.floor(Math.random() * ( mx - mn + 1 )) + mn
getRandomA= (a)->return a[getRandomInt(0,a.length-1)]         

getRandomM= (a)->
    if a.length>0
        res=a[getRandomInt(0,a.length-1)]
        res.not_found=(1==0)
    else
        res=(x:0,y:0,flips:[])
        res.not_found=(1==1)
    return res

class MiniMaxABAlg
    constructor:(depth) ->
        @depth=depth
        @inf_plus=10000
        @inf_minus=-10000
        @cnt=0
        @boards=[]
        
    newBoard: (fs) ->
        if @boards.length>0 
            return @boards.pop()
        else
            return new ReversiBoard(fs)
            
    reuse_board: (b) ->
        @boards.push(b)
    
    opp:(side)->3-side
    
    rate: (board,side)->
        @cnt++
        fs=board.field_size
        res=board.score_side(side)

        if not board.gameOver()            
            corn_rate=20
            brd_rnd_rate=10
            for i in [1..@field_size] 
                for j in [1..@field_size]
                    if board.isCorner(i,j) 
                        if board.field[i][j]==side then res+=corn_rate
                        if board.field[i][j]==opp then res-=corn_rate
                    else
                        if board.isPreCorner(i,j) 
                            if i>board.field_size/2 then ii=board.field_size else ii=1
                            if j>board.field_size/2 then jj=board.field_size else jj=1
                        
                            if board.field[i][j]==side 
                                if board.field[ii][jj]==side then res+=brd_rnd_rate else res-=corn_rate   
                            #if board.field[i][j]==opp 
                            #    if board.field[ii][jj]==opp then res-=brd_rnd_rate else res+=corn_rate
                        else
                            if (i==1) or (j==1) of (i==@board.field_size) or (j==@board.field_size)
                                if board.field[i][j]==side then res+=brd_rnd_rate
                                if board.field[i][j]==opp then res-=brd_rnd_rate
            return res
        else 
            if board.score_side(side)>=board.score_side(opp) 
                return @inf_plus
            else
                return @inf_minus
        
    alfa_beta: (side, board, level, round) ->
        if level==0 or board.gameOver()
            return (rate: @rate(board,side))
        pm=board.possibleMoves(side)
        b=new ReversiBoard(board.field_size)
        opposite=3-side
        my_best_rate=@inf_minus
        done=1==0
        for m in pm
            m.rate=@inf_minus
        for m in pm
            if not done
                board.fill(b)
                b.do_move(m,side)
            
                contra=@alfa_beta(opposite,b,level-1,-my_best_rate)
                r=-contra.rate
                m.rate=r
                if r>=my_best_rate
                    my_best_rate=r
                if my_best_rate>round
                    done=1==1
        t=[]
        for m in pm
            if m.rate==my_best_rate then t.push(m)
        
        return (rate:my_best_rate,move:getRandomA(t),all_moves:t)

    bestMoves:(board,side) ->
        @cnt=0
        res=(@alfa_beta(side, board, @depth, @inf_plus)).all_moves
        return res

    findAnyMove: (board,side) ->
        return getRandomM(@bestMoves(board,side))

class Heuristic
    constructor:()->
        @inf_minus=-10000
        @inf_plus=10000
    
    sf: () -> return ( (a,b)-> return b.flips.length-a.flips.length )            
        
    pre_filter:(board,side,pm)->
        corners=[]
        vars=[]
        #углы
        for m0 in pm
            if board.isCorner(m0.x,m0.y)
                corners.push(m0)
            if not board.isPreCorner(m0.x,m0.y)
                vars.push(m0)
        # параноидальная углобоязнь
        if corners.length>0 
            z=corners #можешь поставить в угол -поставь
        else 
            # можешь не ставить рядом с углом - не ставь
            if vars.length>0 then z=vars else z=pm

        #ф-ция для сортировки вариантов ходов по количеству переворотов
                    
        z.sort(@sf())
        return z;
        
    rate: (board,side)->
        @cnt++
        fs=board.field_size
        res=board.score_side(side)

        if not board.gameOver()            
            corn_rate=40
            brd_rnd_rate=20
            for i in [1..@field_size] 
                for j in [1..@field_size]
                    if board.isCorner(i,j) 
                        if board.field[i][j]==side then res+=corn_rate
                        if board.field[i][j]==opp then res-=corn_rate
                    else
                        if board.isPreCorner(i,j) 
                            if i>board.field_size/2 then ii=board.field_size else ii=1
                            if j>board.field_size/2 then jj=board.field_size else jj=1
                        
                            if board.field[i][j]==side 
                                if board.field[ii][jj]==side then res+=brd_rnd_rate else res-=corn_rate   
                            #if board.field[i][j]==opp 
                            #    if board.field[ii][jj]==opp then res-=brd_rnd_rate else res+=corn_rate
                        else
                            if (i==1) or (j==1) or (i==@board.field_size) or (j==@board.field_size)
                                if board.field[i][j]==side then res+=brd_rnd_rate
                                if board.field[i][j]==opp then res-=brd_rnd_rate
            return res
        else
            opp=3-side
            if board.score_side(side)>=board.score_side(opp) 
                return @inf_plus
            else
                return @inf_minus
        
class MinMaxExAlg
    constructor: (depth) ->
        @heur=new Heuristic()
        @depth=depth
        @boards=[]
        @inf_minus=@heur.inf_minus
        @inf_plus=@heur.inf_plus
        
    newBoard: (fs) ->
        if @boards.length>0 
            return @boards.pop()
        else
            return new ReversiBoard(fs)
            
    reuse_board: (b) ->
        @boards.push(b)
        
        
                 
    #side - чья очередь ходить. он выбирает наилучший ход, минимизирующий сильный ответ оппонента
    mx_mn: (board, side, alpha, depth) ->
        @cnt++
        opp= if side==1 then 2 else 1
        res=(rate:0)
        res.best_moves=[]
      
        if depth<=0 or board.gameOver()
            res.rate=@heur.rate(board,side)
            res.moves=[]
            return res
            
        b = @newBoard(board.field_size)
        b2 = @newBoard(board.field_size)
        res_rate=@inf_minus
        best_moves=[]
        
        sf=(a,b)-> return b.flips.length-a.flips.length            
        z=@heur.pre_filter(board,side,board.possibleMoves(side))
                
        # а в остальном можно подумать
        rez_rate=@inf_minus
        for m in z
            if rez_rate<alpha
                board.fill(b)
                b.do_move(m,side)
            
                if b.gameOver() or depth==1
                    curr_rate=@heur.rate(board,side)
                else
                    # наихудший для нас ответ оппонента
                    r=@inf_plus
                    zz=b.possibleMoves(opp)
                    for mopp in zz.sort(@heur.sf())
                        if r>res_rate #текущая ветка не заведомо хуже ранее найденного решения
                            b.fill(b2)
                            b2.do_move(mopp,opp)
                            # если в следующей итерации встретим ветку больше тетущей, прекратим перебор
                            rr=@mx_mn(b2,side,r,depth-2).rate
                            r=rr if rr<r
                    curr_rate=r
            
                if curr_rate>res_rate
                    best_moves=[]
                    res_rate=curr_rate
                
                if curr_rate==res_rate
                    best_moves.push m
        
        res.rate=res_rate
        res.moves=best_moves
        
        @reuse_board(b)
        @reuse_board(b2)
        return res
            
    bestMoves: (board,side) ->
        @cnt=0
        return @mx_mn(board,side,@inf_plus, @depth).moves
        
        
    findAnyMove: (board,side) ->
        return getRandomM(@bestMoves(board,side))
        
    
#==========================================================================
class Reversi2
    constructor:()->
        #@alg=new ContrAlg(@calg)
        #@alg=new MiniMaxABAlg(4)
        @alg=new MinMaxExAlg(4)
        @undo_data=[]
        #@alg=new MonteAlg(@calg)
        #@alg=new ConservAlg()
        
    clicker: (i,j) -> return (event) => @onCellClick(i,j)

    
    onCellClick: (i,j) ->
        if @state=='busy'
            alert 'Я еще думаю'
            return
        
        #сохраним глубину поиска
        si=(board:@rb.clone(),depth:@alg.depth);
                
        @undo_data.push(si)
        flips = @rb.getFlips(i,j,1)
        if flips.length>0
            @rb.setState(i,j,1)
            @rb.apply(flips)
            
            @last_x=(y:i,x:j)
        else 
            r=@rb.possibleMoves(1)
            if r.length>0 
                alert "Ход неверен, есть возможность правильного хода"
                @state='ready'
                return
        if @rb.gameOver()
            alert("Game over!")
            @state='ready'
            return        
        
               
        @draw()
        if @rb.possibleMoves(2).length>0
            r=@findAnyMove(2)
            myMove=(1==1)
        else myMove=(1==0)
        
        done=@rb.gameOver()
        @last_o=[]
        @state='busy'
        @span_state.html('....Задумался....')
        while myMove and (not done) 
            if r.flips.length>0
                @rb.setState(r.y,r.x,2)
                @rb.apply(r.flips)
                @last_o.push( (y:r.y, x:r.x) )
                
            if @rb.possibleMoves(1).length>0
                myMove=(1==0)
            else
                r=@findAnyMove(2)
                done=(r.flips.length == 0)
        @draw()
        @state='ready'
        @span_state.html('Просмотрено '+@alg.cnt+' позиций глубина '+@alg.depth)
        alert("Game over!") if @rb.gameOver()        
        return

    findAnyMove: (side) ->
        res=@alg.findAnyMove(@rb,side)
        if @alg.cnt>30000 
            if @alg.depth>0 then @alg.depth-- 
        if @alg.cnt<1000 
            if @alg.depth<7 then @alg.depth++ 
        return res

    calc: () ->
        s=@rb.score()
        @spanX.html(s.sx)
        @spanO.html(s.so)

    doUndo: () ->
        if @undo_data.length>0
            uu=@undo_data.pop()
            uu.board.fill(@rb)
            @alg.depth=uu.depth
            @draw()
    
    deftag: (side)->
        if side==1 then return '<b>X</b>'
        if side==2 then return '<b>O</b>'
        return ''
        
    view: (mode) ->
        @mode=mode
        if mode==0 
            @xtag=@deftag(1)
            @otag=@deftag(2)
        if mode==1
            @xtag='<b>#</b>'
            @otag='<b>#</b>'        
        if mode==2
            @xtag=' '
            @otag=' '
        @draw()
        
    draw: () ->
        @calc()
        for i in [1..@field_size] 
            for j in [1..@field_size]
                switch @rb.getState(i,j)
                    when 0 then @field[i][j].html(' ')
                    when 1 then @field[i][j].html(@xtag)
                    when 2 then @field[i][j].html(@otag)
        
        #последний ход всегда показываем            
        if @undo_data.length>0
            @field[@last_x.y][@last_x.x].html(@deftag(@rb.field[@last_x.y][@last_x.x]))
                
            for t in @last_o
                @field[t.y][t.x].html(@deftag(@rb.field[t.y][t.x]))
        
        for pm in @rb.possibleMoves(1)
            @field[pm.y][pm.x].html('?')
    init: () -> 
        ctrldiv=$('<div></div>')
        
        btn_cons=$('<p>Компьютер ирает:</p>').appendTo(ctrldiv)
        btn_greedy=$('<button>Минимаксом</button>').appendTo(ctrldiv)
        btn_greedy.click ()=> @initField()
        
        #btn_cons=$('<button>Осторожно</button>').appendTo(ctrldiv)
        #btn_cons.click ()=>@initFieldConserv()

        #btn_cons2=$('<button>Оптимистично</button>').appendTo(ctrldiv)
        #btn_cons2.click ()=>@initFieldConserv2()
        
        #btn_monte=$('<button>Загадочно</button>').appendTo(ctrldiv)
        #btn_monte.click ()=>@initFieldMonte()
        
        $('<p></p>').appendTo(ctrldiv)
        $('<span>X:</span>').appendTo(ctrldiv)
        @spanX=$('<span></span>').appendTo(ctrldiv)
        $('<p></p>').appendTo(ctrldiv)
        $('<span>O:</span>').appendTo(ctrldiv)
        @spanO=$('<span></span>').appendTo(ctrldiv)
        $('<p></p>').appendTo(ctrldiv)
        
        $('<p>Отображать доску:</p>').appendTo(ctrldiv)
        btn_view_all=$('<button>Все</button>').appendTo(ctrldiv)
        btn_view_all.click ()=> @view(0)
        
        btn_view_space=$('<button>Занятые</button>').appendTo(ctrldiv)
        btn_view_space.click ()=> @view(1)

        btn_view_none=$('<button>Ничего</button>').appendTo(ctrldiv)
        btn_view_none.click ()=> @view(2)
        
        $('<p></p>').appendTo(ctrldiv)
        btn_undo=$('<button>Отмена</button>').appendTo(ctrldiv)
        btn_undo.click ()=> @doUndo()
        
        @span_state=$('<span></span>').appendTo(ctrldiv)
        
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
        @last_o=[]
        @last_x=(x:0,y:0)
        @view(0)
        @undo_data=[]
        @alg.depth=6
        @state='ready'
reversi= new Reversi2
window.g_reversi = reversi

$(document).ready () -> reversi.init()

#========================================================================
# старые алгоритмы
class MinMaxAlg
    constructor: (depth) ->
        @depth=depth
        @boards=[]
        
    newBoard: (fs) ->
        if @boards.length>0 
            return @boards.pop()
        else
            return new ReversiBoard(fs)
            
    reuse_board: (b) ->
        @boards.push(b)
        
        
    rate:(board,side) ->
        opp= if side==1 then 2 else 1
        fs=board.field_size
        res=board.score_side(side)

        if not board.gameOver()
            for i in [1..@field_size] 
                for j in [1..@field_size]
                    if board.isCorner(i,j) and board.field[i][j]==side then res+=15
                    if board.isCorner(i,j) and board.field[i][j]==opp then res-=15

                    if board.isPreCorner(i,j) and board.field[i][j]==side then res-=15
                    if board.isPreCorner(i,j) and board.field[i][j]==opp then res+=15
        
        return res
        
    boardScore: (board, side, depth) ->
        @cnt++;
        if (depth==0) or ( board.gameOver() ) 
            return @rate(board,side)
        else
            return @mx_mn(board,side,depth-1)
    
    #side - чья очередь ходить. он выбирает наилучший ход, минимизирующий сильный ответ оппонента
    mx_mn: (board, side, depth) ->
        opp= if side==1 then 2 else 1
        
        if board.gameOver() then return board.score_side(side)
        
        b = @newBoard(board.field_size)
        b2 = @newBoard(board.field_size)
        res=-1000
        for m in board.possibleMoves(side)
            board.fill(b)
            b.do_move(m,side)
            
            if b.gameOver() 
                curr_rate=b.score_side(side)
            else
                # наихудший для нас ответ оппонента
                r=1000
                for mopp in b.possibleMoves(opp)
                    b.fill(b2)
                    b2.do_move(mopp,opp)
                    if b2.gameOver() or @cnt>120000
                        rr=@rate(b2,side)
                    else
                        rr=@boardScore(b2,side,depth)
                    r=rr if rr<r
                curr_rate=r
            res=curr_rate if curr_rate>res
        @reuse_board(b)
        @reuse_board(b2)
        return res
            
    bestMoves: (board,side) ->
        @cnt=0
        opp= if side==1 then 2 else 1
        pm=board.possibleMoves(side)
        b = @newBoard(board.field_size)
        b2 = @newBoard(board.field_size)
        minrate=1000
        for m in pm
            board.fill(b)
            b.do_move(m,side)
            if b.gameOver()
                if b.score_side(side)>b.score_side(opp)
                    #противник после нашего хода проиграл - ура!
                    r=-1000
                else
                    r=1000
            else
                #оценим его шансы
                r=@boardScore(b, opp, @depth)
                m.rate=r
                minrate=r if minrate>r
            
        tmp=[]
        #из всех своих ходов отберем те, что оставляют меньше шансов противнику
        for m in pm
            if m.rate==minrate
                tmp.push(m)
        #alert "----->"+ @cnt
        @reuse_board(b)
        @reuse_board(b2)
        return tmp
        
        
    findAnyMove: (board,side) ->
        return getRandomM(@bestMoves(board,side))
        
#==========================================================================
# осторожный алгоритм - не дает после себя съесть много
class ConservAlg
    moveRate: (m) ->
        res=m.flips.length
        if @board.isPreCorner(m.y,m.x)
            res=res-15
        if @board.isCorner(m.y,m.x)
            res=res+10
        return res
            
    bestMoves: (board,side) ->
        @board=board
        opp= if side==1 then 2 else 1
        pm=board.possibleMoves(side)
        b = new ReversiBoard(board.field_size)
        b2 = new ReversiBoard(board.field_size)
        cost=1
        for m in pm
            board.fill(b)
            b.do_move(m,side)
            #возможные ответы оппонента на мой ход
            pm2=b.possibleMoves(opp)
            maxopp=0
            #ищем сколько он может максимально перевернуть
            for m2 in pm2
                r=@moveRate(m2)
                maxopp=r if maxopp<r
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
        return getRandomM(@bestMoves(board,side))
        
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
            b.do_move(m,side)
            
            if (board.possibleMoves(opp)).length>0
                a=@preAlg.findAnyMove(board,opp)
                m.rate=@preAlg.moveRate(m)-a.rate
            else m.rate=@preAlg.moveRate(m)
            
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
        return getRandomM(@bestMoves(board,side))

class MonteAlg 
    bestMoves: (board,side) ->
        opp= if side==1 then 2 else 1
        pm=board.possibleMoves(side)
        b = new ReversiBoard(board.field_size)
        b2 = new ReversiBoard(board.field_size)
        cost=1
        algs=[]
        #algs.push(new RandomAlg())
        algs.push(new SimpleAlg())
        algs.push(new ConservAlg())
        algs.push(new ContrAlg(new ConservAlg()))
        for m in pm
            board.fill(b)
            b.apply(m.flips)
            rate=0
            for i in [1..500]
                gameOver=(1==0)
                n=0
                while ( not gameOver ) and ( n < ( board.field_size * board.field_size + 10 ) )
                    gameOver=(1==1) 
                    n++
                    rpm=b.possibleMoves(opp)
                    if rpm.length>0
                        gameOver=(1==0)
                        a=getRandomA(algs)
                        rm=a.findAnyMove(b,opp)
                        #rm=getRandomA(rpm)
                        b.setState(rm.y,rm.x,opp)
                        b.apply(rm.flips)
                    rpm=b.possibleMoves(side)
                    if rpm.length>0
                        gameOver=(1==0)
                        a=getRandomA(algs)
                        rm=a.findAnyMove(b,side)
                        #rm=getRandomA(rpm)
                        b.setState(rm.y,rm.x,side)
                        b.apply(rm.flips)
                rate+=b.score_side(side)
            m.rate=rate
            # углам рейтинг добавим
            m.rate=rate*2 if board.isCorner(m.x,m.y)
            m.rate=rate%2 if board.isPreCorner(m.x,m.y)
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
        return getRandomM(@bestMoves(board,side))

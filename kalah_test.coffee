NO=(1==0)
YES=(1==1)

class KalahSide
    constructor:(cell_count,seed_count,side)->
        @side=side
        @cell_count=cell_count
        @seed_count=seed_count
        @data=[]
        
        @man=0
        @test_board=null    
        
        @ind= if side is 1 then (i)->i-1 else (i)->@cell_count-i
        @init()
    
    
    init:()->
        @data=[]
        @man=0
        for i in [1..@cell_count]
            @data.push(@seed_count)
    
    #доступ к ячейкам
    get_cell:(c)->@data[@ind(c)]
    set_cell:(c,v)->@data[@ind(c)]=v
    inc_cell:(c)->@data[@ind(c)]++
    extract_cell:(c)->
        res=@data[@ind(c)]
        @data[@ind(c)]=0
        res
        
    # заполним собой другой объект
    fill:(b) ->  
        b.man=@man        
        for i in [1..@cell_count]
            b.data[i-1]=@data[i]
            
            
class KalahBoard
    constructor: (cell_count,seed_count)->
        @cell_count=cell_count
        @seed_count=seed_count
        @field=[]
        @field[1]=new KalahSide(cell_count,seed_count,1)
        @field[2]=new KalahSide(cell_count,seed_count,2)
    
    template:()-> return new KalahBoard(@cell_count,0)
    
    fill: (b)->
        @field[1].fill(b.field[1])
        @field[2].fill(b.field[2])
    
    init:()->
        @field[1].init()
        @field[2].init()
        
    do_move:(m,side) ->
        for z in m 
            @move(side,z)
        @post_game_over()
    
    post_game_over: ()->
        if @gameOver()
            for i in [1..@cell_count]
                @field[1].man+=@field[1].extract_cell(i)
                @field[2].man+=@field[2].extract_cell(i)
                
    #делает ход. если он окончен - возвр истину, если нет - ложь
    move: (side,cell)->
        res={}
        n=@field[side].extract_cell(cell)
        next_point=cell+1
        curr_side=side
        res=YES
        while n-- > 0
            done=NO
            if next_point==@cell_count+1
                if curr_side==side
                    # пополняем свою копилку
                    @field[side].man++
                    done=YES
                    res=NO
                #переходим на другую сторону
                curr_side=3-curr_side
                next_point=1
            
            if not done and next_point<=@cell_count
                curr_cnt=@field[curr_side].inc_cell(next_point)
                res=YES
                if n==0 and side==curr_side
                    if curr_cnt>1 
                        #последний бросок в непустую лунку - продолжаем посев
                        n=@field[curr_side].extract_cell(next_point)
                    else
                        # последний бросок в пустую - переложим в свою копилку
                        z=@field[3-side].extract_cell(@cell_count-next_point+1)
                        @field[side].man+=z
                next_point++
        return res
    
    gameOver:()->
        a1=YES
        a2=YES
        for i in [0..@cell_count-1]
            if @field[1].data[i]>0 then a1=NO
            if @field[2].data[i]>0 then a2=NO
        return a1 or a2
        
    possibleMoves:(side) ->
        return @possibleMoves_r(side,100) 

    possibleMoves_r:(side,d) ->
        if d<=0
            alert '0'
        if not @test_board? then @test_board=new KalahBoard(@cell_count,@seed_count)
        res=[]
        for i in [1..@cell_count]
            if @field[side].get_cell(i)>0
                # по непустым лункам
                @fill(@test_board)
                if not @test_board.move(side,i)
                    for m in @test_board.possibleMoves_r(side,d-1)
                        r=[i]
                        r.push(z) for z in m
                        res.push(r)
                else
                    # ход окончен - добавим одношаговый
                    res.push([i])
        return res
           
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

class Heuristic
    constructor:()->
        @inf_minus=-10000
        @inf_plus=10000
    
    sf: () -> return ( (a,b)-> return 0 )            
        
    pre_filter:(board,side,pm)->
        return pm;
        
    rate: (board,side)->

        if not board.gameOver()
            return board.field[side].man-board.field[3-side].man
        else
            s=board.field[side].man
            o=board.field[3-side].man
            for i in [0 .. board.cell_count-1]
                s+=board.field[side].data[i]
                o+=board.field[side].data[i]
            return if s>=o then @inf_plus else @inf_minus
    
class MiniMax
    constructor: (depth) ->
        @heur=new Heuristic()
        @depth=depth
        @boards=[]
        @inf_minus=@heur.inf_minus
        @inf_plus=@heur.inf_plus
        
    newBoard: (t) ->
        if @boards.length>0 
            return @boards.pop()
        else
            return t.template()
            
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
            
        b = @newBoard(board)
        b2 = @newBoard(board)
        res_rate=@inf_minus
        best_moves=[]
        
        #sf=(a,b)-> return b.flips.length-a.flips.length            
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

        
class DisplayBoard
    constructor: (board)->
        @alg=new MiniMax(10)
        @board = board
        @tbl = $('<table></table>')
        @cell_count=board.cell_count
        r1=$('<tr></tr>').appendTo(@tbl)
        @nMan=$('<td width="60" valign="middle" align="center"></td>').appendTo(r1)
        fld=$('<td></td>').appendTo(r1)
        @sMan=$('<td width="60" valign="middle" align="center"></td>').appendTo(r1)
        t2= $('<table></table>').appendTo(fld)
        rn=$('<tr></tr>').appendTo(t2)
        rs=$('<tr></tr>').appendTo(t2)
        #ячейки для полей
        @nFields=[]
        @sFields=[]
        for i in [1..@cell_count]
            nCell=$('<td valign="middle" align="center" width=60 height=60></td>').appendTo(rn)
            @nFields.push (nCell)
            sCell=$('<td valign="middle" align="center" width=60 height=60></td>').appendTo(rs)
            @sFields.push (sCell)
            sCell.click(@clicker(i))
        @after_move=undefined        
        @draw()
        
    draw:()->
        @nMan.html(@board.field[2].man)
        @sMan.html(@board.field[1].man)
        for i in [0..@board.cell_count-1]
            @nFields[i].html(@board.field[2].data[i])
            @sFields[i].html(@board.field[1].data[i])


    clicker: (i) -> return () => @onCellClick(i)
    
    onCellClick: (i) ->
        if @board.field[1].get_cell(i) is 0
            alert "Пустая ячейка"
            return
        else
            if not @board.move(1,i)
                mess= if @board.gameOver() then "Game Over!" else "Ходите дальше!"
                alert mess
                @draw()
                return
        if @board.gameOver()
            alert "Game Over!"
            @draw()
            return
            
        m=@board.possibleMoves(2)
        if m.length>0 
            mm=@alg.findAnyMove @board,2
            @board.do_move(mm,2)

        if @board.gameOver()
            alert "Game Over!"
        @after_move() if @after_move?
        @draw()        

class Kalah 
    constructor: ()->
        @board = new KalahBoard(6,3)

    newGame:()->
        @board.init()
        @display_board.draw()

    init: ()->
        @display_board = new DisplayBoard(@board)
        @display_board.after_move = () => @span_info.html( 'Просмотрено позиций '+ @display_board.alg.cnt ) 

        #@display_board.after_move = () => @span_info.html( 'Просмотрено позиций '+ @display_board.alg.cnt ) 
        divctrl = $('<div></div>').appendTo($('#root'))
        btnInit = $('<button>Новая игра</button>').appendTo(divctrl)
        $('<p></p>').appendTo(divctrl)
        @span_info = $('<span></span>').appendTo(divctrl)
        f=$('<font size="7"></font>').appendTo($('#root'))
        @display_board.tbl.appendTo(f)
        btnInit.click( ()=>@newGame() )
        
    

a = new Kalah

$(document).ready ()->a.init()



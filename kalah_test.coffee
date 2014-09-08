NO=(1==0)
YES=(1==1)

class Utils
    constructor:()->
        @styleWOBord= 
            "border-top": "none",
            "border-bottom": "none",
            "border-left": "none",
            "border-right": "none",
            "padding": "0px"

    
    
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
        return this
    
    #доступ к ячейкам
    get_cell:(c)->@data[@ind(c)]
    set_cell:(c,v)->@data[@ind(c)]=v
    inc_cell:(c)->++@data[@ind(c)]
    extract_cell:(c)->
        res=@data[@ind(c)]
        @data[@ind(c)]=0
        res
        
    # заполним собой другой объект
    fill:(b) ->  
        b.man=@man        
        for i in [1..@cell_count]
            b.data[i-1]=@data[i-1]
        return this
            
            
class KalahBoard
    constructor: (cell_count,seed_count,continue_move)->
        @cell_count=cell_count
        @seed_count=seed_count
        @field=[]
        @field[1]=new KalahSide(cell_count,seed_count,1)
        @field[2]=new KalahSide(cell_count,seed_count,2)
        @continue_move=continue_move
        @gover=NO
    
    template:()-> return new KalahBoard(@cell_count,0,@continue_move)
    
    fill: (b)->
        @field[1].fill(b.field[1])
        @field[2].fill(b.field[2])
        b.continue_move=@continue_move
        b.gover=@gover
    
    init:()->
        @gover=NO
        @field[1].init()
        @field[2].init()
        
    do_move:(m,side) ->
        for z in m 
            @move(side,z)
            #@post_game_over(3-side)
        @check_gover()
        
    check_gover:()->
        s1=0
        s2=0
        for i in [0..@cell_count-1]
            s1+=@field[1].data[i]
            s2+=@field[2].data[i]
        if (s1 is 0) or (s2 is 0)
            @gover=YES
            @field[1].man+=s1
            @field[2].man+=s2
            for i in [0..@cell_count-1]
                @field[1].data[i]=0
                @field[2].data[i]=0

    
    post_game_over: (side)->
        if @gameOver(side)
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
                        #последний бросок в непустую лунку - продолжаем посев, если задана опция игры
                        if @continue_move
                            n=@field[curr_side].extract_cell(next_point)
                    else
                        # последний бросок в пустую - переложим в свою копилку
                        z= @field[3-side].extract_cell(@cell_count-next_point+1)
                        if z>0 
                            # со стороны оппонента+1 свой
                            @field[curr_side].man+=(z+1)
                            @field[curr_side].extract_cell(next_point)
                next_point++
        return res
    
    gameOver:(side)->
        return @gover
        
    possibleMoves:(side) ->
        return @possibleMoves_r(side,100) 

    possibleMoves_r:(side,d) ->
        if d<=0
            alert '0'
        if not @test_board? then @test_board=@template()
        res=[]
        for i in [1..@cell_count]
            if @field[side].get_cell(i)>0
                # по непустым лункам
                @fill(@test_board)
                done= @test_board.move(side,i)
                @test_board.check_gover()
                if (not done) and (not @test_board.gover)
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

        if not board.gameOver(side)
            return board.field[side].man-board.field[3-side].man
        else
            s=board.field[side].man
            o=board.field[3-side].man
            for i in [0 .. board.cell_count-1]
                s+=board.field[side].data[i]
                o+=board.field[3-side].data[i]
            return if s>=o then @inf_plus else @inf_minus

class AlfaBeta            
    constructor: (depth) ->
        @heur=new Heuristic()
        @depth=depth
        @boards=[]
        @inf_minus=@heur.inf_minus
        @inf_plus=@heur.inf_plus
        @fullscan=YES
        
    newBoard: (t) ->
        if @boards.length>0 
            return @boards.pop()
        else
            return t.template()
            
    reuse_board: (b) ->
        @boards.push(b)
    ###
    integer procedure F2(ref(position) p,integer alpha,integer beta): 
    begin integer m,t; ref(position) q; 
    generate(p); 
    q := first(p); 
    if q = NULL then F2 := f(p) else 
    begin m := alpha; 
     while q <> NULL and m < beta do 
      begin t := -F2(q, -beta, -m); if t > m then m := t; q := next(q); 
      end; 
     F2 := m; 
    end; 
    end.
    ###    
    ABPrun:(board,side,a,b,depth)->
        @cnt++
        opp= if side==1 then 2 else 1
        res=(rate:0)
        res.best_moves=[]
      
        if depth<=0 or board.gameOver(side)
            res.rate=@heur.rate(board,side)
            res.moves=[]
            return res
            
        brd = @newBoard(board)
        res_rate=@inf_minus
        best_moves=[]
        
        #sf=(a,b)-> return b.flips.length-a.flips.length            
        z=@heur.pre_filter(board,side,board.possibleMoves(side))
                
        # а в остальном можно подумать
        res_rate=a
        
        for m in z
            if res_rate<b
                board.fill(brd)
                brd.do_move(m,side)
                if brd.gover 
                    r=@heur.rate(brd,side) 
                else r=-@ABPrun(brd,opp,-b,-res_rate,depth-1)
                if r>res_rate then res_rate=r
        return res_rate

    bestMoves: (board,side) ->
        @cnt=0
        opp=3-side
        if board.gover
            return []
        brd = @newBoard(board)
        res_rate=@inf_minus
        best_moves=[]
        
        #sf=(a,b)-> return b.flips.length-a.flips.length            
        z=@heur.pre_filter(board,side,board.possibleMoves(side))
                
        # а в остальном можно подумать
        res_rate=@inf_minus
        result=[]
        for m in z
            board.fill(brd)
            brd.do_move(m,side)
            if brd.gover then r=@heur.rate(brd,side) else r=-@ABPrun(brd,opp,@inf_plus,@inf_minus,@depth-1)
            if r>res_rate 
                result=[]
                res_rate=r
            if r==res_rate
                result.push m
        return result
    findAnyMove: (board,side) ->
        return getRandomM(@bestMoves(board,side))
        
class MiniMax
    constructor: (depth) ->
        @heur=new Heuristic()
        @depth=depth
        @boards=[]
        @inf_minus=@heur.inf_minus
        @inf_plus=@heur.inf_plus
        @fullscan=NO
        @test_full_scan1=YES
        @test_full_scan2=NO
        @break_by_cnt=YES
        @break_cnt=25000
        
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
        res.broken=NO
        if @break_by_cnt and ( @cnt > @break_cnt )  
            @broken=YES
            return res
      
        if depth<=0 or board.gameOver(side)
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
            
                if b.gover or depth==1
                    curr_rate=@heur.rate(board,side)
                    curr_fs_rate=curr_rate
                else
                    # наихудший для нас ответ оппонента
                    r=@inf_plus
                    zz=b.possibleMoves(opp)
                    for mopp in zz.sort(@heur.sf())
                        if r>=res_rate #текущая ветка не заведомо хуже ранее найденного решения
                            b.fill(b2)
                            b2.do_move(mopp,opp)
                            # если в следующей итерации встретим ветку больше тетущей, прекратим перебор
                            rr=@mx_mn(b2,side,r,depth-2).rate
                            ###
                            if @test_full_scan1 
                                b.fill(b2)
                                b2.do_move(mopp,opp)
                                rrfs=@mx_mn(b2,side,@inf_plus+10,depth-2).rate
                                if rrfs<r and rr>=r
                                    # фуллскан вернул другое!
                                    alert 'TreeBug1'
                            ###
                            r=rr if rr<r
                    curr_rate=r
                    
                    ###
                    if @test_full_scan2
                        r=@inf_plus
                        zz=b.possibleMoves(opp)
                        for mopp in zz.sort(@heur.sf())
                            b.fill(b2)
                            b2.do_move(mopp,opp)
                            # если в следующей итерации встретим ветку больше тетущей, прекратим перебор
                            rr=@mx_mn(b2,side,r,depth-2).rate
                            r=rr if rr<r
                        curr_fs_rate=r
                    ###
                #if @test_full_scan2
                #    if (curr_fs_rate>res_rate) and not (curr_rate>res_rate)  
                #        alert "TreeBug2"
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
        #alert @break_by_cnt
        if not @break_by_cnt
            @cnt=0
            d=@depth
            @eff_depth=d
            res=@mx_mn(board,side,@inf_plus, d)
            return res.moves
        else    
            d=@depth
            done=NO
            
            while not done
                @cnt=0
                @broken=NO
                res=@mx_mn(board,side,@inf_plus, d)
                if @broken
                    d--
                else
                    done=YES
                
            @eff_depth=d
            return res.moves
        
        
    findAnyMove: (board,side) ->
        return getRandomM(@bestMoves(board,side))

        
class DisplayBoard
    constructor: ()->
        @u=new Utils()
        @alg=new MiniMax(4)
        #@alg=new AlfaBeta(4)
        @nord_moves=[]
        #будет ли доска реагировать на мышку
        @enabled=YES
        @busy=NO
        @on_info=undefined       
        @after_move=undefined      
        @after_gover=undefined    
        @after_busy=undefined    
        @log_hist=undefined  
        
    set_board: (board)->
        @board=board
        @cell_count=board.cell_count
        @tbl=$('<table></table>').css(@u.styleWOBord).css('cellspasing',5)
        @cell_count=board.cell_count
        r1=$('<tr></tr>').appendTo(@tbl)

        styleMan=
            valign:"middle",
            "text-align":"center",
            width:60,
            "font-size":"xx-large",
            "font-weight":"bold"

        @nMan=$('<td></td>').appendTo(r1).css(styleMan)
        fld=$('<td></td>').appendTo(r1).css(@u.styleWOBord)
        @sMan=$('<td></td>').appendTo(r1).css(styleMan)
        t2= $('<table></table>').css(@u.styleWOBord).css(("border-collapse":"collapse","border":"1")).appendTo(fld)
        rni=$('<tr></tr>').appendTo(t2)
        rn=$('<tr></tr>').appendTo(t2)
        rs=$('<tr></tr>').appendTo(t2)
        rsi=$('<tr></tr>').appendTo(t2)
        #ячейки для полей
        @nFields=[]
        @sFields=[]
        
        styleHdr=
            valign:"middle",
            "text-align":"center",
            width:60,
            height:30
        
        styleBody=
            valign:"middle",
            "text-align":"center",
            width:60,
            height:60,
            "font-size":"xx-large",
            #"font-weight":"bold",
            "border-top": "solid",
            "border-bottom": "solid",
            "border-left": "solid",
            "border-right": "solid",
            "border": "1px solid black",
            "padding": "0px"

        for i in [1..@cell_count]
            nCell=$('<td></td>').appendTo(rn).css(styleBody)
            @nFields.push (nCell)
            sCell=$('<td></td>').appendTo(rs).css(styleBody)
            @sFields.push (sCell)
            
            sCell.click(@clicker(i)) if @enabled
            $('<td>' + (i) + '</td>').appendTo(rni).css(styleHdr)
            $('<td >' + (@cell_count-i+1) + '</td>').css(styleHdr).appendTo(rsi)
        @draw()
        
    draw:()->
        @nMan.html(@board.field[2].man)
        @sMan.html(@board.field[1].man)
        for i in [0..@board.cell_count-1]
            @nFields[i].html(@board.field[2].data[i])
            @sFields[i].html(@board.field[1].data[i])


    clicker: (i) -> return () => @onCellClick(i)
    
    gover_msg:()->"Game Over! "+@board.field[2].man+':'+@board.field[1].man
    
    onInfo:()->
        on_info() if on_info?
    onCellClick: (i) ->
        return if not @enabled
        if @busy
            @onInfo 'Идет расчет'
            return
        finish=NO
        if @board.field[1].get_cell(i) is 0
            @onInfo "Пустая ячейка"
            return
        else
            @log_hist(1,i) if @log_hist?
            done= @board.move(1,i)
            @board.check_gover()
            if not done
                log_mess= "Ход юга "+ (@board.cell_count-i+1) 
                mess= if @board.gover then @gover_msg() else "Ходите дальше!"
                if @board.gover
                    @after_gover() if @after_gover?
                @onInfo mess
                finish=YES
            else
                if @board.gover
                    @onInfo (@gover_msg())
                    finish=YES
                    @after_gover() if @after_gover?
        @draw()
        
        return if finish 
        @busy=YES
        @after_busy() if @after_busy?
        
        setTimeout((()=>@robot()) , 100)
        #@robot()
    robot:()->
        pm=@board.possibleMoves(2)
        if pm.length>0 
            moves=@alg.findAnyMove @board,2
            # заплатка - алгоритм не вернул ход, хотя он возможен
            if moves.length==0 
                moves=getRandomA(pm)
            for m in moves
                @log_hist(2,m) if @log_hist?
                @board.do_move([m],2)
                
            @nord_moves=[]
            @nord_moves.push(@board.cell_count - z + 1) for z in moves 

        if @board.gameOver(1)
            @board.post_game_over(1)
            @draw()
            @after_gover() if @after_gover?
            @onInfo( @gover_msg() )
            
        @after_move() if @after_move?
        
        if @board.gameOver(1)
            @onInfo( @gover_msg() )
        @busy=NO
        @draw()        

class Kalah 
    constructor: ()->
        @board = new KalahBoard(8,6)
        @init_cnt()

    init_cnt:()->
        @cn_robot=0
        @cn_man=0

    newGame:(cell,seed,depth,cont_move,full_scan)->
        @board=new KalahBoard(cell,seed,cont_move==1)
        @display_board.set_board(@board)
        @div_b.html(' ')
        @div_b.append(@display_board.tbl)
        @display_board.draw()
        @display_board.alg.depth=depth
        @display_board.alg.fullscan=(full_scan==1)
        @div_hist.html('')
        
    html_sel:()->
        $('<select><select>')
        
    html_opt:(sel,key,val)->
        $('<option value="' + val+ '">'+key+'</option>').appendTo(sel)

    html_table:()->
        $('<table></table>')
    html_tr:(tbl)->
        $('<tr></tr>').appendTo(tbl)
    html_td:(tr)->
        $('<td></td>').appendTo(tr)
        
    html_opt:(sel,key,val)->
        $('<option value="' + val+ '">'+key+'</option>').appendTo(sel)
        
    info:()->
        @span_info.html('Север ходит '+@display_board.nord_moves.join(',')+ '  Просмотрено позиций '+ @display_board.alg.cnt +  ' Глубина  '+ @display_board.alg.eff_depth) 
    after_busy:()->
        @span_info.html('... задумался ....') 
    
    onInfo:(i)->
        @span_info.html(i) 
    log_hist:(side,cell)->
        b=@board.template()
        @board.fill(b)
        @db2.set_board(b)
        color = if side==1 then "#b0c4de" else "#c4b0de"
        d=$("<div></div>").css("background-color", color)
        m="Ход " + ( if side==1 then "юга" else "севера") + " " + (@board.cell_count-cell+1)
        d.append("<p>"+m+"</p>") 
        d.append(@db2.tbl)
        @div_hist.prepend(d)
     
    #call-back game over
    after_gover:()->
        if @board.field[1].man>@board.field[2].man then @cn_man++
        if @board.field[2].man>@board.field[1].man then @cn_robot++
        @span_cnt.html('Счет (север:юг) '+@cn_robot+":"+@cn_man)
    init: ()->
        @display_board = new DisplayBoard(@board)
        @display_board.log_hist=(side,cell)=>@log_hist(side,cell)
        @db2 = new DisplayBoard(@board)
        @db2.enabled=NO
        
        @display_board.after_move = () => @info()
        @display_board.after_gover = () => @after_gover()        
        @display_board.after_busy = () => @after_busy() 
        @display_board.onInfo = (i) => @onInfo(i) 
        #@display_board.after_move = () => @span_info.html( 'Просмотрено позиций '+ @display_board.alg.cnt ) 
        divctrl = $('<div></div>').appendTo($('#root'))
        
        btnInit = $('<button>Новая игра</button>').appendTo(divctrl)
        btnOpts = $('<button>Настройки....</button>').appendTo(divctrl).click(()=>@opts.toggle())
        $('<p></p>').appendTo(divctrl)

        styleWOBord= 
            "border-top": "none",
            "border-bottom": "none",
            "border-left": "none",
            "border-right": "none",
            "padding": "0px"
                       
        
        t=@html_table().hide().css(styleWOBord).appendTo(divctrl)
        @opts=t
        r=@html_tr(t)
        @html_td(r).css(styleWOBord).html('Лунок')
        
        @selCell=@html_sel().appendTo(@html_td(r).css(styleWOBord))
        @html_opt(@selCell,4,4)
        @html_opt(@selCell,6,6).attr("selected", "selected");
        @html_opt(@selCell,8,8)
        
        r=@html_tr(t)

        @html_td(r).css(styleWOBord).html('Камней')
        
        @selSeed=@html_sel().appendTo(@html_td(r).css(styleWOBord))
        @html_opt(@selSeed,3,3)
        @html_opt(@selSeed,4,4)
        @html_opt(@selSeed,5,5)
        @html_opt(@selSeed,6,6).attr("selected", "selected")
        
        r=@html_tr(t)
        @html_td(r).css(styleWOBord).html('Глубина просмотра')
        
        @selDepth=@html_sel().appendTo(@html_td(r).css(styleWOBord))
        @html_opt(@selDepth,3,3)
        @html_opt(@selDepth,4,4).attr("selected", "selected")
        @html_opt(@selDepth,5,5)
        @html_opt(@selDepth,6,6)

        r=@html_tr(t)
        @html_td(r).css(styleWOBord).html('Продолжить посев')
        
        @selContMove=@html_sel().appendTo(@html_td(r).css(styleWOBord))
        @html_opt(@selContMove,'Да',1).attr("selected", "selected");
        @html_opt(@selContMove,"Нет",2)

        r=@html_tr(t)
        @html_td(r).css(styleWOBord).html('Полный перебор')
        @selFullScan=@html_sel().appendTo(@html_td(r).css(styleWOBord))
        @html_opt(@selFullScan,'Да',1).attr("selected", "selected");
        @html_opt(@selFullScan,"Нет",2)
        
        $('<p></p>').appendTo(divctrl)
        @span_cnt = $('<span></span>').appendTo(divctrl)
        $('<p></p>').appendTo(divctrl)
        @span_info = $('<span></span>').appendTo(divctrl)
        
        f=$('<font size="7"></font>').appendTo($('#root'))
        @div_b=$('<div></div>').appendTo(f)
        @div_hist=$('<p></p>').appendTo($('#root'))
        @div_hist=$('<p>История</p>').appendTo($('#root'))
        @div_hist=$('<div></div>').appendTo($('#root'))
        @newGame(6,6,4,1,1)
        fngc= ()=>
            cc=parseInt(@selCell.val())
            sc=parseInt(@selSeed.val())
            d=parseInt(@selDepth.val())
            cm=parseInt(@selContMove.val())
            fs=parseInt(@selFullScan.val())
            @newGame(cc,sc,d,cm,fs)
        btnInit.click( fngc )
        
    

a = new Kalah

$(document).ready ()->a.init()



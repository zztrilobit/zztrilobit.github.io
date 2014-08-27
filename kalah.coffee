NO=(1==0)
YES=(1==1}

class KalahSide
    constructor:(cell_count,seed_count,side)->
        @side=side
        @cell_count=cell_count
        @seed_count=seed_count
        
        @man=0
        @test_board=null    
        
        @ind= if side is 1 then (i)->i-1 else (i)->@cell_count-i
        for i in [1..cell_count]
            @data.push[seed_count]
        
    init:()
        @data=[]
        @man=0
        for i in [1..cell_count]
            @data.push[seed_count]
    
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
            b.data[i-1]=@data[1]
            
            
class KalahBoard
    constructor: (cell_count,seed_count)->
        @cell_count=cell_count
        @seed_count=seed_count
        @field=[]
        @field[1]=new KalahSide(cell_count,seed_count,1)
        @field[2]=new KalahSide(cell_count,seed_count,1)
    fill: (b)->
        @field[1].fill(b.field[1])
        @field[2].fill(b.field[2])
    
    init:()
        @field[1].init()
        @field[2].init()
        
    #делает ход. если он окончен - возвр истину, если нет - ложь
    move: (side,cell)->
        res={}
        n=@field[side].extract_cell(cell)
        next_point=cell+1
        curr_side=side
        while n-- > 0
            done=NO
            if next_point==@cell_count+1
                if curr_side==side
                    # пополняем свою копилку
                    field[side].man++
                    done=YES
                    res=NO
                #переходим на другую сторону
                curr_side=3-curr_side
                next_point=1
            
            if not done and next_point<=@cell_count
                @field[curr_side].inc_cell(next_point)
                res=YES
                if n==0 and side==curr_side
                    if res.cnt>1 
                        #последний бросок в непустую лунку - продолжаем посев
                        n=@field[curr_side].extract_cell(next_point)
                    else
                        # последний бросок в пустую - переложим в свою копилку
                        z=@field[3-side].extract_cell(@cell_count-next_point+1)
                        @field[side].man+=z
                next_point++
        return res
        
    possible_moves:(side) ->
        if @test_board is null then @test_board=new KalahBoard(@cell_count,@seed_count)
        res=[]
        for i in [1..@cell_count]
            if @field[side].get_cell(i)>0
                # по непустым лункам
                @fill(@test_board)
                if not @test_board.move(i)
                    for m in @test_board.possible_moves(side)
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
               
class DisplayBoard 
    constructor: (board)->
        @alg=new MiniMax()
        @board = board
        @tbl = $('<table></table>')
        @cell_count=b.cell_count
        r1=$('<tr></tr>').appendTo(tbl)
        @nMan=$('<td></td>').appendTo(r1)
        fld=$('<td></td>').appendTo(r1)
        @sMan=$('<td></td>').appendTo(r1)
        t2= $('<table></table>').appendTo(fld)
        rn=$('<tr></tr>'.appendTo(t2)
        rs=$('<tr></tr>'.appendTo(t2)
        #ячейки для полей
        @nFields=[]
        @sFelds=[]
        for i in [1..@cell_count]
            nCell=$('<td valign="middle" align="center" width=60 height=60></td>').appendTo(rn)
            @nFields.push nCell
            sCell=$('<td valign="middle" align="center" width=60 height=60></td>').appendTo(rs)
            @sFields.push nCell
            cell.click(@clicker(i))

        @draw()
        
    draw:()->
        @nMan.html(board.field[2].man)
        @sMan.html(board.field[1].man)
        for i in [0..cell_count-1]
            @nFields[i].html(@board.field[2].data[i])
            @sFields[i].html(@board.field[1].data[i])


    clicker: (i) -> return () => @onCellClick(i)
    
    onCellClick: (i) ->
        if board.field[1].get_cell(i) is 0
            alert "Пустая ячейка"
            return
        else
            if board.move(1,i)
                alert "Ход сделан"
            else
                alert "Ходите дальше!"
                return
        m=@board.possible_moves(2)
        if m.length>0 
            board.move(2,z) for z in getRandomA(m)
           

class Kalah 
    constructor: ()->
        @board = new KalahBoard(6,3)

    newGame:()->
        @board.init()
        @display_board.draw()

    init: ()->
        @display_board = new DisplayBoard(@board)
        #@display_board.after_move = () => @span_info.html( 'Просмотрено позиций '+ @display_board.alg.cnt ) 
        divctrl = $('<div></div>').appendTo($('#root'))
        btnInit = $('<button>Новая игра</button>').appendTo(divctrl)
        $('<p></p>').appendTo(divctrl)
        @span_info = $('<span></span>').appendTo(divctrl)
        @display_board.tbl.appendTo($('#root'))
        btnInit.click( ()=>@newGame() )
        
    

a = new Kalah

$(document).ready ()->a.init()



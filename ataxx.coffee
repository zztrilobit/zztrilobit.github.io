getRandomInt = (mn, mx) ->
    return Math.floor(Math.random() * (mx - mn + 1)) + mn

getRandomA = (a) ->
    return a[getRandomInt(0, a.length - 1)]

class  AtaxxBoard 
    strt_pos: () ->
        @spp = []
        @spp.push([[3, 0], [3, 1], [3, 2], [0, 3], [1, 3], [2, 3], [4, 3], [5, 3], [6, 3], [3, 4], [3, 5], [3, 6]])
        @spp.push([[3, 0], [1, 2], [2, 2], [4, 2], [5, 2], [0, 3], [1, 3], [5, 3], [6, 3], [1, 4], [2, 4], [4, 4], [5, 4], [3, 6]])
        @spp.push([[1, 0], [5, 0], [0, 1], [6, 1], [3, 3], [0, 5], [6, 5], [1, 6], [5, 6]])
        @spp.push([[2, 0], [4, 0], [2, 1], [4, 1], [0, 3], [6, 3], [2, 5], [4, 5], [2, 6], [4, 6]])
        @spp.push([[3, 0], [3, 1], [0, 3], [1, 3], [5, 3], [6, 3], [3, 5], [3, 6]])
        @spp.push([[3, 1], [2, 2], [4, 2], [1, 3], [5, 3], [2, 4], [4, 4], [3, 5]])
        @spp.push([[2, 0], [4, 0], [0, 2], [6, 2], [0, 4], [6, 4], [2, 6], [4, 6]])
        @spp.push([[3, 0], [2, 1], [4, 1], [1, 2], [5, 2], [0, 3], [6, 3], [1, 4], [5, 4], [2, 5], [4, 5], [3, 6]])
        @spp.push([[2, 1], [4, 1], [1, 2], [5, 2], [1, 4], [5, 4], [2, 5], [4, 5]])
        @spp.push([[2, 0], [4, 0], [2, 2], [4, 2], [1, 3], [5, 3], [2, 4], [4, 4], [2, 6], [4, 6]])
        @spp.push([[3, 1], [3, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [3, 4], [3, 5]])
        @spp.push([[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [1, 2], [5, 2], [1, 3], [5, 3], [1, 4], [5, 4], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]])
        @spp.push([[2, 1], [3, 1], [4, 1], [1, 2], [5, 2], [1, 3], [5, 3], [1, 4], [5, 4], [2, 5], [3, 5], [4, 5]])
        @spp.push([[2, 1], [4, 1], [1, 2], [2, 2], [4, 2], [5, 2], [1, 4], [2, 4], [4, 4], [5, 4], [2, 5], [4, 5]])
        @spp.push([[1, 1], [5, 5], [1, 5], [5, 1]])
        @spp.push([[1, 1], [2, 1], [4, 1], [5, 1], [1, 2], [5, 2], [1, 4], [5, 4], [1, 5], [2, 5], [4, 5], [5, 5]])
        @spp.push([[3, 2], [2, 3], [3, 3], [4, 3], [3, 4]])
        @spp.push([[3, 2], [2, 3], [4, 3], [3, 4]])
        @spp.push([[3, 1], [3, 2], [1, 3], [2, 3], [4, 3], [5, 3], [3, 4], [3, 5]])
        @spp.push([[2, 0], [3, 0], [4, 0], [3, 1], [0, 2], [6, 2], [0, 3], [1, 3], [5, 3], [6, 3], [0, 4], [6, 4], [3, 5], [2, 6], [3, 6], [4, 6]])
        @spp.push([[2, 0], [4, 0], [3, 1], [0, 2], [6, 2], [1, 3], [5, 3], [0, 4], [6, 4], [3, 5], [2, 6], [4, 6]])
        @spp.push([[2, 0], [4, 0], [3, 1], [0, 2], [6, 2], [1, 3], [5, 3], [0, 4], [6, 4], [3, 5], [2, 6], [4, 6]])
        @spp.push([[1, 1], [3, 1], [5, 1], [1, 3], [3, 3], [5, 3], [1, 5], [3, 5], [5, 5]])
        @spp.push([[2, 2], [4, 2], [3, 3], [2, 4], [4, 4]])
        @spp.push([[1, 1], [5, 1], [2, 2], [4, 2], [3, 3], [2, 4], [4, 4], [1, 5], [5, 5]])
        @spp.push([[2, 0], [3, 0], [4, 0], [2, 1], [4, 1], [0, 3], [6, 3], [2, 5], [4, 5], [2, 6], [3, 6], [4, 6]])
        @spp.push([[1, 0], [3, 0], [5, 0], [0, 1], [2, 1], [4, 1], [6, 1], [1, 2], [3, 2], [5, 2], [0, 3], [2, 3], [4, 3], [6, 3], [1, 4], [3, 4], [5, 4], [0, 5], [2, 5], [4, 5], [6, 5], [1, 6], [3, 6], [5, 6]])
        @spp.push([[1, 1], [5, 1], [2, 2], [4, 2], [2, 4], [4, 4], [1, 5], [5, 5]])
        @spp.push([[3, 0], [2, 1], [4, 1], [0, 3], [6, 3], [2, 5], [4, 5], [3, 6]])
        @spp.push([[3, 0], [0, 3], [6, 3], [3, 6]])
        @spp.push([[3, 1], [1, 3], [5, 3], [3, 5]])
        @spp.push([[2, 0], [3, 0], [4, 0], [0, 2], [1, 2], [3, 2], [5, 2], [6, 2], [0, 3], [6, 3], [0, 4], [1, 4], [3, 4], [5, 4], [6, 4], [2, 6], [3, 6], [4, 6]])
        @spp.push([[2, 1], [4, 1], [0, 2], [1, 2], [3, 2], [5, 2], [6, 2], [3, 3], [0, 4], [1, 4], [3, 4], [5, 4], [6, 4], [2, 5], [4, 5]])
        @spp.push([[2, 0], [4, 0], [2, 1], [4, 1], [0, 2], [6, 2], [0, 3], [3, 3], [6, 3], [0, 4], [6, 4], [2, 5], [4, 5], [2, 6], [4, 6]])
    

    init: () ->
        for i in [1..7]
            for j in [1..7]
                @field[i][j] = 0
        @field[1][1] = 1
        @field[7][7] = 1
        @field[1][7] = 2
        @field[7][1] = 2
        pp = getRandomA(@spp)
        
        for p in pp 
            @field[p[0] + 1][p[1] + 1] = 3

    constructor: () ->
        @strt_pos()
        @field_size = 7
        @field = ([0..7] for i in [0..7])
        
        @dirs = []
        for i in [-1..1]
            for j in [-1..1]
                if i!=0 and j!=0
                    @dirs.push((dx:i,dy:j))
        @init()
        
    copy_to: (b)->
        for i in [1..7]
            for j in [1..7]
                b.field[i][j]=@field[i][j]
    

    getState:(i,j)-> return @field[i][j]
 

    empty_move:()-> 
        res =
            side: 0
            from: 
                x: 0
                y: 0
            to:
                x: 0
                y: 0
            type: '',
            flips: []
        return res

    in_field:(i, j) ->
        return (i > 0) and (i <= @field_size) and (j > 0) and (j <= @field_size)

    is_empty: (i, j) -> 
        if (@in_field(i, j)) 
            return @field[i][j] == 0
        else
            return 1 == 0

    opposite: (side) ->
        if (side == 1) then 2 else 1
    
    list_cnt: (y, x, side) ->
        res = []
        for di in [-1..1]
            for dj in [-1..1]
                if @in_field(y + di, x + dj) and ((di != 0) or (dj != 0))
                    if (@field[y + di][x + dj] == side)
                        res.push( x: x + dj, y: y + di)
                    
        return res

    do_move: (side, m)-> 
        @field[m.to.y][m.to.x] = side
        if (m.type == 'j') 
            @field[m.from.y][m.from.x] = 0
        for flip in m.flips
            @field[flip.y][flip.x] = side
        return
        

    construct_move: (from, to, side) ->
        dx = to.x - from.x
        dy = to.y - from.y
        m = @empty_move()
        m.side = side
        m.from.x = from.x
        m.from.y = from.y
        m.to.x = to.x
        m.to.y = to.y
        if ((dx == 2) or (dy == 2) or (dx == -2) or (dy == -2)) 
            m.type = 'j'
        else
            m.type = 's'
      
        m.flips = @list_cnt(to.y, to.x, @opposite(side))
        return m
    
    count: (side)->
        res=0
        for i in [1..@field_size] 
            for j in [1..@field_size]
                res+=1 if @field[i][j]==side
        return res
        
    game_over: () ->
        if (@possible_moves(1).length > 0) then  return 1 == 0
        if (@possible_moves(2).length > 0) then return 1 == 0
        return 1 == 1

    possible_moves: (side) -> 
        res = []
        for i in [1..7]
            for j in [1..7]
                if (@field[i][j] == side)
                    for di in [-2..2]
                        for dj in [-2..2]
                            ni = i + di
                            nj = j + dj
                            if (@is_empty(ni, nj) and ((di != 0) or (dj != 0))) 
                                res.push(@construct_move( ( y: i, x: j),(  y: ni, x: nj) ) )
        return res
                            
class MiniMax
    constructor:()->
        @inf_plus=10000
        @inf_minus=-10000
        @cnt=0
    
    opp:(side)->3-side
    
    rate: (board,side)->
        @cnt++
        c=board.count(side)
        if c==0 then return @inf_minus
        co=board.count(3-side)
        if co==0 then return @inf_plus
        return c-co
        
    alfa_beta: (side, board, level, round) ->
        if level==0 or board.game_over()
            return (rate: @rate(board,side))
        pm=board.possible_moves(side)
        b=new AtaxxBoard()
        opposite=3-side
        my_best_rate=@inf_minus
        done=1==0
        for m in pm
            m.rate=@inf_minus
        for m in pm
            if not done
                board.copy_to(b)
                b.do_move(side,m)
            
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
        
        return (rate:my_best_rate,move:getRandomA(t))
        
    
    find_move:(side,board,depth)->
        @cnt=0
        return @alfa_beta(side,board,depth,@inf_plus).move

class DisplayBoard 
    constructor: (board)->
        @alg=new MiniMax()
        @xtag = '<b>X</b>'
        @otag = '<b>O</b>'
        @board = board
        @field_size = board.field_size
        @tbl = $('<table></table>')
        @field=([0..7] for i in [0..7])
        @var_x=[]
        @after_move=0
        
        @dirs = []
        for i in[-1..1]
            for j in [-1..1]
                if ((i != 0) or (j != 0)) 
                    @dirs.push( (  dx: i,  dy: j ))
        
        @ready()
        rnm=['','g','f','e','d','c','b','a']
        for i in [1..@field_size]
            row = $('<tr></tr>')
            $('<td valign="middle" align="center" width=40 height=40>'+rnm[i]+'</td>').appendTo(row)
            for j in [1..@field_size]
                cell = $('<td valign="middle" align="center" width=40 height=40></td>')
                cell.appendTo(row)
                @field[i][j] = cell
                cell.click(@clicker(i, j))
            @tbl.append(row)
        row = $('<tr></tr>')
        $('<td valign="middle" align="center" width=40 height=40>'+'</td>').appendTo(row)
        for j in [1..@field_size]
            $('<td valign="middle" align="center" width=40 height=40>'+j+'</td>').appendTo(row)
        @tbl.append(row)
        @draw()


    ready:()->
        @click_phase = 1
        @from = 
            x: 0,
            y: 0
        @to = 
            x: 0,
            y: 0
        @var_x=[]

    clicker: (i, j) -> return () => @onCellClick(i, j)
 
    onCellClick: (i, j) ->
        if (@click_phase == 1) 
            if (@board.field[i][j] == 1) 
                @from.x = j
                @from.y = i
                @click_phase = 2
                @var_x = []
                for dx in [-2..2]
                    for dy in [-2..2]
                        if (dx != 0 or dy != 0)
                            nx = j + dx
                            ny = i + dy
                            if (nx >= 1 and ny >= 1 and nx <= @board.field_size and ny <= @board.field_size) 
                                if (@board.field[ny][nx] == 0) 
                                    @var_x.push( ( x: nx,  y: ny) )
                @draw()
            else alert('Человек играет крестиками')
        
            return
      
        if (@click_phase == 2) 
            dx = j - @from.x
            dy = i - @from.y
            err = 1 == 0
            if ((dx > 2) or (dx < -2) or (dy > 2) or (dy < -2)) 
                err = 1 == 1
                err_msg = "Окончание хода слишком далеко от начала"
        
            if (!@board.is_empty(i, j)) 
                err = 1 == 1
                err_msg = "Поле занято"
        
            if (!err) 
                m = @board.construct_move(@from, ( y: i, x: j), 1)
                @board.do_move(1, m)
                if (!@board.game_over())    
                    pm = @board.possible_moves(2)
                    if (pm.length > 0) 
                        #m= getRandomA(pm)
                        m=@alg.find_move(2,@board,4)
                        @board.do_move(2,m)
            else 
                alert(err_msg)
                    
            @ready()
        @draw()
        if @after_move!=0 then (@after_move)()

    draw: () ->
        for i in [1..@field_size]
            for j in [1..@field_size]
                s=@board.getState(i, j)
                if s==0 then @field[i][j].html(' ')
                if s==1 then @field[i][j].html(@xtag)
                if s==2 then @field[i][j].html(@otag)
                if s==3 then @field[i][j].html('#')
        if (@click_phase == 2) 
            for v in @var_x
                @field[v.y][v.x].html('?')


class Ataxx 
    constructor: ()->
        @board = new AtaxxBoard(7)

    newGame:()->
        @board.init()
        @display_board.draw()

    afterMove:() ->
        @span_info.html( 'Просмотрено позиций '+ @display_board.alg.cnt )
        go=''
        if @board.game_over()
            if @board.count(1)==@board.count(2) then go='Ничья!'
            if @board.count(1)>@board.count(2) then go='Победа X'
            if @board.count(1)<@board.count(2) then go='Победа O'
            
        @game_info.html( 'Счет: X-' + @board.count(1) + ' O-'+ @board.count(2)+ ' ' + go)
        
        
    init: ()->
        @display_board = new DisplayBoard(@board)
        @display_board.after_move = () => @afterMove()
        divctrl = $('<div></div>').appendTo($('#root'))
        btnInit = $('<button>Новая игра</button>').appendTo(divctrl)
        $('<p></p>').appendTo(divctrl)
        @game_info = $('<span></span>').appendTo(divctrl)
        $('<p></p>').appendTo(divctrl)
        @span_info = $('<span></span>').appendTo(divctrl)
        @display_board.tbl.appendTo($('#root'))
        btnInit.click( ()=>@newGame() )
        
    

a = new Ataxx

$(document).ready ()->a.init()



class AtaxxBoard
    constructor: (inipos)->
        @field_size = 7
        @field=([1..@field_size+1] for i in [1..@field_size+1])
        for i in [1..7]
            for j in [1..7]
                @field[i][j]=0
        @field[1][1]=1
        @field[7][7]=1
        @field[1][7]=2
        @field[7][1]=2
        
    empty_move: () -> (side:0, from:(x:0,y:0), to:(x:0,y:0), type:'', flips:[])

    in_field:(i,j) -> (i>0) and (i<=@field_size) and (j>0) and (j<=@field_size)  
    is_empty:(i,j) -> 
        if @in_field(i,j)
            return @field[i][j]==0
        else 
            return 1==0

    opposite: (side) -> if side==1 then 2 else 1

    #список под захват
    list_cnt: (y,x,side) ->
        res=[]
        for di in [-1..1]
            for dj in [-1..1]
                if @in_field(y+di,x+dj) and ( (di!=0) or (dj!=0) )
                    if @field[y+di][x+dj]==side 
                        res.push( (x:x+dj, y:y+di) )
        return res
 
    #сделать ход
    do_move:(side,m) ->
        @field[m.to.y][m.to.x] = side
        if m.type == 'j' then @field[m.from.y][m.from.x]=0
        for flip in m.flips 
            @field[flip.y][flip.x]=side
            
    construct_move: (from,to,side)->
        dx=to.x-from.x
        dy=to.y-from.y
        m=@empty_move()
        m.side=side
        m.from.x=from.x
        m.from.y=from.y
        m.to.x=to.x
        m.to.y=to.y
        if (dx==2) or (dy==2) or (dx==-2) or (dy==-2) then m.type='j' else m.type='s'
        m.flips=@list_cnt(to.y,to.x,@opposite(side))
        
    #доступные ходы
    possible_moves: (side) ->
        res=[]
        for i in [1..7]
            for j in [1..7]
                if @field[i][j]==side
                    for di in [-2,2]
                        for dj in [-2,2]
                            ni=i+di
                            nj=j+dj
                            if is_empty(ni,nj) and ((di!=0) or (dj!=0)) 
                                res.push( @construct_move( (y:i,x:j), (y:ni,x:nj) ) )
        return res
        
# только показ доски
class DisplayBoard
    constructor:(board)->
        @xtag='X'
        @otag='O'
        @board=board
        @field_size=board.field_size
        
        @tbl=$('<table></table>')
        @field=([1..@field_size+1] for i in [1..@field_size+1])
        
        @ready()
        
        for i in [1..@field_size] 
            row=$('<tr></tr>')
            for j in [1..@field_size]
                cell=$('<td valign="middle" align="center" width=40 height=40></td>')
                cell.appendTo(row)
                @field[i][j]=cell
                
                cell.click @clicker(i,j)
            @tbl.append(row)
        @draw

    ready: () ->
        @click_phase=1
        @from = (x:0,y:0)
        @to = (x:0,y:0)
    
    clicker: (i,j) -> return (event) => @onCellClick(i,j)
    
    onCellClick: (i,j) ->
        if (click_phase==1)  
            if (@board.field[i][j]==1)
                @from.x=j
                @from.y=i
                @click_phase=2
            else alert('Человек играет крестиками')
            
        if click_phase==2
            dx= j - @from.x
            dy= i - @from.y
            err=(1==0)
            if (dx>2) or (dx<-2) or (dy>2) or (dy<-2)
                err=(1==1)
                err_msg="Окончание хода слишком далеко от начала"
            if not @board.is_empty(i,j)
                err=(1==1)
                err_msg="Поле занято"
            if not err 
                m=@board.construct_move( from, (y:i, x:j) )
                board.do_move(m)
            else 
                alert err_msg
            @ready()
            @draw()
        
    draw: ()->
        for i in [1..@field_size] 
            for j in [1..@field_size]
                switch @rb.getState(i,j)
                    when 0 then @field[i][j].html(' ')
                    when 1 then @field[i][j].html(@xtag)
                    when 2 then @field[i][j].html(@otag)
                    when 3 then @field[i][j].html('*')

class Ataxx
    constructor: ()->
        @board=new AtaxxBoard(7)
    init:()->
        @display_board=new DisplayBoard(@board)
        @display_board.tbl.appendTo($('#root'))
        
a=new Ataxx
$(document).ready () -> a.init()
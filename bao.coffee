class BaoSide
	constructor:(side)->
        #2-север 1-юг
        @side=side
        
        @rows=[]
        # 0 фронт 1 бэк
        @front=[]
        @back=[]
        for i in [1..8] by 1
            @front.put 0
            @back.put 0
        @rows.put @front
        @rows.put @back
	


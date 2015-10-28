
var AlphaBeta= (function(){
	var constructor=function() {
		
		
	};
	
	var proto=constructor.prototype;
	/*
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
  
	*/
	proto.ABPrun=function(board,iface,player,a,b,depth)
	{
		var res={rate:0};
        if (this.time_check) {
			if ((new Date()).getTime()>this.plan) {
				this.overtaim=true;
				return res;
			};
			
		};
	    //ABPrun:(board,s,a,b,depth)->
		
		//print('prun'+player+" "+a+" "+b+" "+depth)
        this.cnt++;
        var opp=1-player;
        res.best_moves=[];
        
		
		
        if ((depth<=0) || (board.gameOver())) {
            res.rate=iface.rate(board,player);
            res.best_moves=[];
			
            return res;
		};        
			
        var brd = (iface.newBoard());
        var res_rate=iface.inf_minus;
        var best_moves=[];
        
        //#sf=(a,b)-> return b.flips.length-a.flips.length            
        var z=iface.filtered_moves(board,player);
                
        //# а в остальном можно подумать
        res_rate=a;
        
		var i ;
		for(i=0;i<z.length;i++){
			if (this.time_check) {
				if ((new Date()).getTime()>this.plan) {
					this.overtaim=true;
					return res;
				}	;
			
			};
            m=z[i];       
            if (res_rate<b || true) {
                board.fill(brd);
				
                brd.doMove(player,m);
                if (brd.gameOver()) {
                    r=iface.rate(brd,player);
				}
                else r=-this.ABPrun(brd,iface,opp,-b,-res_rate,depth-1).rate;
                if (r>res_rate) res_rate=r;
			}
		};
		iface.reuse(brd);
		res.rate=res_rate;
		res.best_moves=m;
        return res;
	};
	
    proto.bestMoves=function (board,iface,player,depth) {
		
        this.cnt=0
        var opp=1-player;
        if (board.gameOver()) return [];
		
        var brd = iface.newBoard();
		
        var res_rate=iface.inf_minus;
        var best_moves=[];
        
        //#sf=(a,b)-> return b.flips.length-a.flips.length            
        var z=iface.filtered_moves(board,player);
                
        //# а в остальном можно подумать
        var res_rate=iface.inf_minus;
        var result=[];
        var i ;
		for(i=0;i<z.length;i++){
            var m=z[i];
            		
            board.fill(brd);
				
            brd.doMove(player,m);
            
			if (brd.gameOver())  { 
				r=iface.rate(brd,player) 
			} else {
		        r=-this.ABPrun(brd,iface,opp,iface.inf_minus,iface.inf_plus,depth-1).rate
			};
			
			
            if ( r>res_rate ) {
                result=[];
                res_rate=r;
			};
            if (r==res_rate) result.push( m);
		}
		return result;
	};

    proto.move=function (board,iface,side,depth){
		this.time_check=false;
		this.overtaim=false;
		iface.cnt_rates=0;
		var a=this.bestMoves(board,iface,side,depth);
		var i=Math.floor(Math.random() * ( a.length ));
		return a[i];
	};
	
	proto.move_time1=function (board,iface,side,depth,ms){
		this.time_check=true;
		
		var d=depth, done=false;
		
		while (!done){
		  iface.cnt_rates=0;
		  this.plan=(new Date()).getTime()+ms;
		  this.overtaim=false;
		
		
		  var a=this.bestMoves(board,iface,side,d);
		  // если не уложились по времени, уменьшаем глубину
		  if (this.overtaim) { d-- }
		  else {
		     var i=Math.floor(Math.random() * ( a.length ));
			 this.real_depth=d;
		     return a[i];
		  }
		};
	};
	proto.move_time=function (board,iface,side,depth,ms){
		this.time_check=true;
		
		var d=2, done=false ,  cc=0, result='';
		this.plan=(new Date()).getTime()+ms;
		
		while (!done){
		  iface.cnt_rates=0;
		  
		  this.overtaim=false;
		
		
		  var a=this.bestMoves(board,iface,side,d);
		  // если не уложились по времени, уменьшаем глубину
		  if ((!this.overtaim) && (d<100)) {
		     var i=Math.floor(Math.random() * ( a.length ));
			 this.real_depth=d;
		     result =a[i];
			 cc=iface.cnt_rates;
			 this.real_depth=d;
			 d++;
		  } else {
			  done=true;
			  iface.cnt_rates=cc;
			  return result;
		    };
 	          if ((new Date()).getTime()>this.plan) {
			done=true;
			};

		  };
		};
	
	return constructor;
     	
})();            
        


//============================================================================
var TsoroBoard=(function(){
	var constr=function(){
		this.brd=[[],[]];
		
	};
	
	var proto=constr.prototype;

	proto.fill=function(dst){
		var i;
		for (i=0;i<this.bs*2;i++) {
			dst.brd[0][i]=this.brd[0][i];
			dst.brd[1][i]=this.brd[1][i];
		}
	};
	
	proto.doMove=function(player,move) {
		var i ;
		this.moveStep(player,move);
		
		return this.gameOver();
	};
	
	proto.gameOver=function(){
		// игра кончается, когда с любой стороны закончились камни
		var s1=0,s2=0,i;
		for(i=0;i<this.bs*2-1;i++){
			s1+=this.brd[0][i];
			s2+=this.brd[1][i];
		};
		return (s1==0) || (s2==0)
	};
	
	//все возможные ходы
	proto.genMoves=function(player){
		var res=[];
		var i,c;
		for (i=0;i<this.bs*2;i++) {
			if (this.brd[player][i]>0) {
				var r={};
				r.line=this.cell_line(i);
				r.cell=this.cell_col(i);
				res.push( r );
			}
		}
		
		return res;
	};
	//=============================================
	
	proto.fillBoard=function(s){
		 var i,j;
		 for (i=0;i<this.bs*2;i++) {
			 this.brd[0][i]=s; 
			 this.brd[1][i]=s;
		}
	};
	
	// клонирует доску в пустую
	proto.clone = function(akb) {
		akb.makeBoard(this.bs);
	    this.fill(akb);
	};
	
	proto.clone_new = function() {
		var akb=new TsoroBoard()
		akb.makeBoard(this.bs);
	    this.fill(akb);
		return akb;
	};
	//заполняет только поле с фишками
	
	//создает временую доску для расчета цепочек шагов
	proto.makeTemp=function() {
		if (!this.is_tmp) {
			this.is_tmp=true;
			this.tmp=new TsoroBoard();
			this.tmp.makeBoard(this.bs)
		}
	};
	
	//форматирует массив под размер поля
	proto.makeBoard=function(bs){
		this.brd=[[],[]];
		this.bs=bs;
		var i;
		for(i=0;i<bs*2;i++){this.brd[0].push(0);
		this.brd[0].push(0);
		};
		
	};
	
	//индекс игровой лунки в массиве
	proto.index=function(line,cell){
		//0 линия - задняя 1 - передняя
		return line==0 ? cell : this.bs*2-1-cell;
	};
	
	//какой линии принадлежит лунка, соответствующая ячейке?
	proto.cell_line=function(c) {return (c<this.bs) ? 0 : 1; };
	proto.cell_col=function(c) {return c<this.bs ? c : 2*this.bs-1 - c; };
	
	proto.getCell=function(p,l,i){
		return this.brd[p][this.index(l,i)];
	};
	
	 
	

	 //одиночный посев. если ход окончен - true, не окончен - false
	 // в массив a кладем состояния доски для слайд-шоу
	proto.moveVisualStep=function(player,m,a){
		
		var line=m.line, cell=m.cell;
		var my_side=this.brd[player];
		var opp_side=this.brd[1-player];
		
		var curr=this.index(line,cell), cc=my_side[curr], done=cc==0;
		my_side[curr]=0;
		a.push(this.clone_new());
		
		while (!done) {
				curr=curr==this.bs*2-1 ? 0 : curr+1;
				my_side[curr]++;
				a.push(this.clone_new());
				cc--;
				if (cc==0) {
					var l=this.cell_line(curr);
					if (l==0) {
						if (my_side[curr]==1) {done=true} else {
							cc=my_side[curr];
							my_side[curr]=0;
							a.push(this.clone_new())
					} } else {
						    //alert(1);
							var oi=this.bs-1-this.cell_col(curr),
							    o=1-player,
								i1=this.index(0,oi),
								i2=this.index(1,oi); 
								
								cc=opp_side[i1]+opp_side[i2];
								//alert(oi+" "+i1+' '+i2);
								if (cc>0) {
									opp_side[i1]=0;
									opp_side[i2]=0;
									a.push(this.clone_new());
								} else {
									done=true;
								}
							
						}
					}
				}
	};


	
	//одиночный посев. если ход окончен - true, не окончен - false
	proto.moveStep=function(player,m){
		
		var line=m.line, cell=m.cell;
		
		var my_side=this.brd[player];
		var opp_side=this.brd[1-player];
		
		var curr=this.index(line,cell), cc=my_side[curr], done=cc==0;
		my_side[curr]=0;
		
		while (!done) {
				curr=curr==this.bs*2-1 ? 0 : curr+1;
				my_side[curr]++;
				cc--;
				if (cc==0) {
					var l=this.cell_line(curr);
					if (l==0) {
						if (my_side[curr]==1) {done=true} else {
							cc=my_side[curr];
							my_side[curr]=0;
					} } else {
						    //alert(1);
							var oi=this.bs-1-this.cell_col(curr),
							    o=1-player,
								i1=this.index(0,oi),
								i2=this.index(1,oi); 
								
								cc=opp_side[i1]+opp_side[i2];
								//alert(oi+" "+i1+' '+i2);
								if (cc>0) {
									opp_side[i1]=0;
									opp_side[i2]=0;
								} else {
									done=true;
								}
							
						}
					}
				}
	};
	
	proto.cnt_player=function(p){
		var i,c=0;
		//считаем камушки на стороне  игрока
		for(i=0;i<this.bs*2;i++){
			c+=this.brd[p][i];
		}
		return c;
	};
	
	return constr;	
})()


/////////////////////////////////////////////////////
// фабрика досок, оценочная ф-ция, предфильтрация ходов для абстрактного алгоритма
var TsoroAInterface=(function(){
	var constructor=function(bs){
		this.bs=bs;
		this.boards=[];
		this.inf_plus=100000;
		this.inf_minus=-100000;
		this.cnt_rates=0;
	};
	proto=constructor.prototype;
	
	proto.newBoard=function() {
		
		if (this.boards.length!=0) {
			return this.boards.pop();
		} else {
			var r= new TsoroBoard();
			r.makeBoard(this.bs);
			return r;
		};
	};
	proto.reuse=function(b) {
		this.boards.push(b);
	};
	
	proto.filtered_moves=function(b,p){
		return b.genMoves(p);
	};
	
	proto.rate=function(board,player){
		var oplayer=1-player;
		this.cnt_rates++;
		return board.cnt_player(player)-board.cnt_player(oplayer);
		
	};
	return constructor;
})();

var KalahBoard=(function(){
	var constructor=function(){
		this.brd=[];
		this.bs=0;
		this.is_tmp=false;	
		
	};
	var proto=constructor.prototype;
    //====================================================================
	// ф-ции для общения с ai
	proto.fill=function(dst){
		var i;
		for(i=0;i<(this.bs+1)*2;i++){dst.brd[i]=this.brd[i]};
	};
	
	proto.doMove=function(player,move) {
		var i ;
		for(i=0;i<move.length;i++) {
			this.moveStep(player,move[i]);
		};
		return this.gameOver();
	};
	
	proto.gameOver=function(){
		var i;
		var cnt=[0,0];
		
		for (i=0;i<this.bs;i++) {
			cnt[0]+=this.brd[this.index(0,i)];
			cnt[1]+=this.brd[this.index(1,i)];
		};
		if ((cnt[0]==0)||(cnt[1]==0)) 
		{ 
	      //print ("GOVER0"+this.brd);
			
			
		}
		if (cnt[0]==0) {
			this.brd[this.k_ind[1]]+=cnt[1];
		};
		if (cnt[1]==0) {
			this.brd[this.k_ind[0]]+=cnt[0];
		};
		if ((cnt[0]==0)||(cnt[1]==0)) {
			for (i=0;i<this.bs;i++) {
				this.brd[this.index(0,i)]=0;
				this.brd[this.index(1,i)]=0;
			};
			//print ("GOVER1"+this.brd);
			
			return true;
		} else {
			return false;
		}
	};
	
	//все возможные ходы
	proto.genMoves=function(player){
		var res=[];
		var i,c;
		this.makeTemp();
		for (c=0;c<this.bs;c++) {
			i=this.index(player,c);
			if (this.brd[i]!=0) {
				this.fill(this.tmp);
				//print('ccc'+this.tmp.brd);
				r=this.tmp.moveStep(player,c);
				//print('sss'+this.tmp.brd);
				if (r) {
					//ход закончился
					res.push([c]);
					
				} 
				else {
					//нужно продолжать
					var a;
					a=this.tmp.genMoves(player);
					if (a.length==0) {
						res.push([c]);
					} else {
						var ii;
						for (ii=0;ii<a.length;ii++) {
							//print('rr11  '+[c].concat(a[ii]));
							res.push([c].concat(a[ii]));
						}
					}
				}
			}
		}
		return res;
	};
	//=============================================
	
	proto.fillBoard=function(s){
		 var i;
		 for (i=0;i<this.bs;i++) {
			 this.brd[i]=s; 
			 this.brd[i+this.bs+1]=s;
		}
		 this.brd[this.bs]=0;
		 this.brd[this.bs*2+1]=0;
	};
	
	// клонирует доску в пустую
	proto.clone = function(akb) {
		akb.makeBoard(this.bs);
	    this.fill(akb);
	};
	
	proto.clone_new = function() {
		var akb=new KalahBoard()
		akb.makeBoard(this.bs);
	    this.fill(akb);
		return akb;
	};
	//заполняет только поле с фишками
	
	//создает временую доску для расчета цепочек шагов
	proto.makeTemp=function() {
		if (!this.is_tmp) {
			this.is_tmp=true;
			this.tmp=new KalahBoard();
			this.tmp.makeBoard(this.bs)
		}
	};
	
	//форматирует массив под размер поля
	proto.makeBoard=function(bs){
		this.brd=[];
		this.bs=bs;
		var i;
		for(i=0;i<(bs+1)*2;i++){this.brd.push(0)};
		
		this.k_ind=[bs,bs*2+1];
	};
	
	//индекс игровой лунки в массиве
	proto.index=function(player,cell){return cell+player*(this.bs+1)};
	
	proto.getCell=function(p,i){return this.brd[this.index(p,i)];
	};
	
	//какому игроку принадлежит лунка, соответствующая ячейке? 
	proto.side =function(ind){ return ind<=this.bs ? 0 : 1;};
	

		//одиночный посев. если ход окончен - true, не окончен - false
	proto.moveVisualStep=function(player,cell,a){
		var i=this.index(player,cell);
		var done=false;
		var esc_ind=this.k_ind[1-player];
		var last=this.bs*2+1;
		var cpy;
		while (!done) {
			// берем из ячейки в руку
			var cc=this.brd[i];
			this.brd[i]=0;
			a.push(this.clone_new());
			//пропускаем калах оппонента
			
			for (;cc>0;) {
				i = (i==last ? 0 : i+1);
				if (i!=esc_ind) { 
					this.brd[i]++;
			        a.push(this.clone_new());
					cc--;
				};
				
			};
			if (this.side(i)!=player)	{
				//попали на сторону оппонента
				return true ;
			};
			if (i==this.k_ind[player]) {
                //попали в свой калах				
			    return false;
			};
			
			if (this.brd[i]==1) {
				//заберем из противоположной ячейки
				var ocell=this.bs*2-i;
				
				this.brd[this.k_ind[player]]+=this.brd[ocell];
				this.brd[ocell]=0;
				a.push(this.clone_new());
			
				return true;
			};
			
		};
	};


	
	//одиночный посев. если ход окончен - true, не окончен - false
	proto.moveStep=function(player,cell){
		var i=this.index(player,cell);
		var done=this.brd[i]==0;
		var esc_ind=this.k_ind[1-player];
		var last=this.bs*2+1;
		
		while (!done) {
			// берем из ячейки в руку
			var cc=this.brd[i];
			this.brd[i]=0; 
			//пропускаем калах оппонента
			
			for (;cc>0;) {
				i = (i==last ? 0 : i+1);
				if (i!=esc_ind) { 
					this.brd[i]++;
					cc--;
				};
				
			};
			if (this.side(i)!=player)	{
				//попали на сторону оппонента
				return true ;
			};
			if (i==this.k_ind[player]) {
                //попали в свой калах				
			    return false;
			};
			
			if (this.brd[i]==1) {
				//заберем из противоположной ячейки
				var ocell=this.bs*2-i;
				
				this.brd[this.k_ind[player]]+=this.brd[ocell];
				this.brd[ocell]=0;
				
				return true;
			};
			
		};
	};
	
	// сколько лежит в калахе
	proto.getKala=function(player){
		return this.brd[this.k_ind[player]];
	};
	
	// начальное расположение семян по лункам
	return constructor;
	
})();

/////////////////////////////////////////////////////
// фабрика досок, оценочная ф-ция, предфильтрация ходов для абстрактного алгоритма
var KalahAInterface=(function(){
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
			var r= new KalahBoard();
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
		return board.getKala(player)-board.getKala(oplayer);
		
	};
	return constructor;
})();



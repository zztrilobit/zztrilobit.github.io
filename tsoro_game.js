
var TsoroGame=(function(){
	var kg=function(){};
	
	var proto=kg.prototype;
	
	proto.tag=function(t){
		return Utils.tag(t)
	};
	proto.btn=function(txt,f){
		var that=this;
		return this.tag('button').html(txt).click(function(){f.apply(that);});
	};
	
	proto.startGame=function(){
		this.ng(8,2);
		
	};
	proto.startGame7=function(){
		this.ng(7,2);
		
	};
	proto.startGame6=function(){
		this.ng(6,2);
		
	};
	proto.startGame5=function(){
		this.ng(5,2);
		
	};
	proto.startGame4=function(){
		this.ng(4,2);
		
	};
	
	proto.log_move=function(p,i){
		var v=new TsoroView();
		v.makeBoard(this.bs);
		v.draw(this.board);
		var r=this.tag("div");
		this.tag("div").html('Ход ' + ((p==0)? 'Юга' : 'Севера')+"  "+(i.cell+1)+" "+(i.line==0 ? "внешняя" : "внутренняя")).appendTo(r);
		v.view_board.appendTo(r);
		this.hist_place.prepend(r);
	};
	
	proto.ng=function(bs,seeds){
		this.thinking=false;
		this.bs=bs;
		this.view=new TsoroView();
		this.view.makeBoard(bs);
		this.brd_place.html("");
		this.view.view_board.appendTo(this.brd_place);
	
		this.board=new TsoroBoard();
		this.board.makeBoard(bs);
		this.board.fillBoard(seeds);
		this.view.draw(this.board);
	  
		this.ki = new TsoroAInterface(this.bs);
		this.ab = new AlphaBeta();
		
		var that=this;
		this.view.click(function(p,l,c){that.onclick(p,l,c);});
		this.hist_place.html("");
	};
	
	proto.msg=function(m){
		this.alert_place.html(m);
	};
	
	//разворачиваем себя в корневом элементе
	proto.init=function(place){
		place.html('');
		this.ctrl_place=this.tag("div").appendTo(place);
		
		this.btn('Играть',this.startGame).css({"font-size":"x-large"}).appendTo(this.ctrl_place);
		this.btn('Доска 7',this.startGame7).css({"font-size":"x-large"}).appendTo(this.ctrl_place);
		this.btn('Доска 6',this.startGame6).css({"font-size":"x-large"}).appendTo(this.ctrl_place);
		this.btn('Доска 5',this.startGame5).css({"font-size":"x-large"}).appendTo(this.ctrl_place);
		this.btn('Доска 4',this.startGame4).css({"font-size":"x-large"}).appendTo(this.ctrl_place);
		
		this.brd_place=this.tag("div").appendTo(place);
		this.alert_place=this.tag("div").appendTo(place);
		this.hist_place=this.tag("div").appendTo(place);

	}; 
	
	proto.next_slide=function(nord_move){
		if (this.slides.length>0) {
			var b=this.slides.shift();
			this.view.draw(b);
			that=this;
			setTimeout(function(){that.next_slide(nord_move);},500);
			
		} else {
			this.view.draw(this.board);
			if (nord_move) {
				var that=this;
			    this.msg("думаю....");
			    this.thinking=true;
			    setTimeout(function(){that.nord_move();},100);
			} else {
				if (this.board.gameOver()) {this.gover_msg(); }else {this.cnt_msg();}
			
			};
		}
	};
	
	proto.gover_msg=function(){
		if (this.board.cnt_player(1)>this.board.cnt_player(0)) 
			this.msg("Победа Севера")
			else
				this.msg("Победа Юга");
	};
	
	proto.cnt_msg=function(){
		this.msg("Север: " + this.board.cnt_player(1) + "    Юг: "  + this.board.cnt_player(0))
	};
	proto.onclick=function(p,l,i){
		
		if (this.thinking) {
			this.msg("север думает, ждите");
			return;
		};
		if (p==1) {
			this.msg("Вы играете за Юг");
			return;
		};
		if (this.board.getCell(0,l,i)==0){
			this.msg("В лунке ничего нет!");
			return;
		};
		
		this.log_move(0,{"line":l,"cell":i});
		var bb=this.board.clone_new();
		var move_done=this.board.moveStep(0,{"line":l,"cell":i});
		
		var a=[];
		bb.moveVisualStep(0,{"line":l,"cell":i},a);
		this.slides=a;
		that=this;
		
		
		
		if (this.board.gameOver()) {
			setTimeout(function(){that.next_slide(false);},500);
			return;
		};
		if (true) {
			setTimeout(function(){that.next_slide(true);},500);
			
			 
		} else {
			setTimeout(function(){that.next_slide(false);},500);
			this.msg("Продолжайте!");
		};
	};
	
	proto.nord_move=function(){
			var m;
			m=this.ab.move_time(this.board,this.ki,1,6,3000);
			//m=this.board.genMoves(1)[0];
			var jj;
			//for (k in m) alert (k);
			var bb=this.board.clone_new();
			this.slides=[];
			
			this.log_move(1,m);
			this.board.moveStep(1,m);
			bb.moveVisualStep(1,m,this.slides);
			
			
			if (this.board.gameOver()) {
				this.gover_msg();
			} else	this.msg("");
			//this.view.draw(this.board);
			var that=this;
            setTimeout(function(){that.next_slide(false);},500);
			
			this.thinking=false;
			if (!this.board.gameOver()) {
				this.msg("Глубина анализа " + this.ab.real_depth +" (" +this.ki.cnt_rates+" позиций)");
			};
	};
	return kg;	
})();

 

var on_load=(function(){
	
	
 });

var KalahGame=(function(){
	var kg=function(){};
	
	var proto=kg.prototype;
	
	proto.tag=function(t){
		return Utils.tag(t)
	};
	proto.btn=function(txt,f){
		var that=this;
		return Utils.button(txt).click(function(){f.apply(that);});
	};
	
	proto.startGame=function(){
		this.ng(this.props.getInt('size') ,this.props.getInt('cnt'));
		
		if (this.props.getInt('nmove')==1) this.nord_move();
	};
	
	proto.log_move=function(p,i){
		var v=new KalahView();
		v.makeBoard(this.bs);
		v.draw(this.board);
		var r=this.tag("div");
		this.tag("div").html('Ход ' + ((p==0)? 'Юга' : 'Севера')+"  "+(this.bs-i)).appendTo(r);
		v.view_board.appendTo(r);
		this.hist_place.prepend(r);
	};
	
	proto.ng=function(bs,seeds){
		this.thinking=false;
		this.bs=bs;
		this.view=new KalahView();
		this.view.makeBoard(bs);
		this.brd_place.html("");
		this.view.view_board.appendTo(this.brd_place);
	
		this.board=new KalahBoard();
		this.board.makeBoard(bs);
		this.board.fillBoard(seeds);
		this.view.draw(this.board);
	  
		this.ki = new KalahAInterface(6);
		this.ab = new AlphaBeta();
		
		var that=this;
		this.view.click(function(p,c){that.onclick(p,c);});
		this.hist_place.html("");
	};
	
	proto.msg=function(m){
		this.alert_place.html(m);
	};
	
    proto.showProps=function(){
		this.props.view.el.toggle();
	};	//разворачиваем себя в корневом элементе
	proto.init=function(place){
		place.html('');
		this.ctrl_place=this.tag("div").appendTo(place);
		
		this.btn('Играть',this.startGame).css({"font-size":"x-large"}).appendTo(this.ctrl_place);
		
				this.btn('Настройки',this.showProps).css({"font-size":"x-large"}).appendTo(this.ctrl_place);
		
		this.props=p=new PropList();
		
		p.make([
			{id:'size', caption:'Длина поля', type: 'select', 
			  content: 
			    {
				4:'4',	5:'5',	6:'6',7:'7',8:'8', 
				9:'9', 10:'10'
				}
			},
			{id:'cnt', caption:'Фишек', type: 'select', 
			  content: 
			    {
				4:'4',	5:'5',	6:'6'
				}
			},
			{id:'nmove', caption:'Север начинает', type: 'select', 
			  content: 
			    {
				0:'Нет',	1:'Да'
				}
			},
        ],{"font-size":"x-large"});
		p.view.appendTo(this.ctrl_place).hide();

		
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
			};
		}
	};
	proto.onclick=function(p,i){
		if (this.thinking) {
			this.msg("север думает, ждите");
			return;
		};
		if (p==1) {
			this.msg("Вы играете за Юг");
			return;
		};
		if (this.board.getCell(0,i)==0){
			this.msg("В лунке ничего нет!");
			return;
		};
		
		this.log_move(0,i);
		var bb=this.board.clone_new();
		var move_done=this.board.moveStep(0,i);
		
		var a=[];
		bb.moveVisualStep(0,i,a);
		this.slides=a;
		that=this;
		
		
		
		if (this.board.gameOver()) {
			this.msg("Игра окончена");
			setTimeout(function(){that.next_slide(false);},500);
			return;
		};
		if (move_done) {
			setTimeout(function(){that.next_slide(true);},500);
			
			 
		} else {
			setTimeout(function(){that.next_slide(false);},500);
			this.msg("Продолжайте!");
		};
	};
	
	proto.nord_move=function(){
			var m;
			m=this.ab.move_time(this.board,this.ki,1,6,3000);
			var jj;
			var bb=this.board.clone_new();
			this.slides=[];
			for(jj=0;jj<m.length;jj++) {
				this.log_move(1,m[jj]);
				this.board.moveStep(1,m[jj]);
				bb.moveVisualStep(1,m[jj],this.slides);
			};
			
			if (this.board.gameOver()) {
				this.msg("Игра окончена");
			};
			this.msg("");
			//this.view.draw(this.board);
			var that=this;
            setTimeout(function(){that.next_slide(false);},500);
			
			this.thinking=false;
			this.msg("Глубина анализа " + this.ab.real_depth +" (" +this.ki.cnt_rates+" позиций)");
	};
	return kg;	
})();

 


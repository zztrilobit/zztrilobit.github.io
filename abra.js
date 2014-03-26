var abra={
  word_len:0,
  word_cnt:0,
  test_cnt:0,
  current:0,
  err_cnt:0,
  true_ansver:"",
  start_time:0,
  
  Now : function() {
    return (new Date()).getTime();
  },
  
  init:function(){
     
    $("#abra_description").show();
    $("#abra_control").show();
    $("#abra_work").hide();
    $("#abra_result").hide();
	
	
	
  },
  start:function(){
    $("#abra_work").show();
    $("#abra_description").hide();
    $("#abra_control").hide();
	
	this.current=0;
	this.err_cnt=0;
	
	this.word_len=parseInt($("#abra_word_len").val());
	this.word_cnt=parseInt($("#abra_word_cnt").val());
	this.test_cnt=parseInt($("#abra_test_cnt").val());
	this.start_time=this.Now  ();
	this.gen_test();
	$("#abra_result").html("");
	self=this;
	$("#abra_ansver").keydown(function(event)
	   { if (event.which == 13) {
	        event.preventDefault();
	        self.check();
	    }
	   });
  },
  
  randA: function(){
    var aa="qwrtpsdfghjklzxcvbnm";
	var  bb="eyuioa";

	var    a= aa.charAt(this.getRandomArbitrary(0,aa.length-1)),
	    b= bb.charAt(this.getRandomArbitrary(0,bb.length-1));
	return (this.getRandomArbitrary(1,10)>5) ? a+b : b+a;
	}  ,
  
  randWord: function() {
     var i,res="";
	 for(i=1;i<=this.word_len;i++) res+=this.randA();
	 return res;
  },
   randWords: function() {
     var i,res="";
	 for(i=1;i<=this.word_cnt;i++) res+=this.randWord()+ ((i==this.word_cnt)? "":" ");

	 return res;
  },
  //Случайное целое в диапазоне
  getRandomArbitrary: function (min, max) {
    return Math.floor(Math.random() * (max - min+0.9999) + min);
  } ,

  gen_test: function(){
     $("#abra_is_error").hide();
	 $("#abra_work_ansver").hide();	  
     $("#abra_work_memo").show();

	 this.true_ansver=this.randWords();
	 $("#abra_sample").html(this.true_ansver);
	 $("#abra_ansver_btn").focus();
  },
  
  ready:function(){
  //скроем панель вопроса, покажем панель ответа
   $("#abra_work_ansver").show();
   $("#abra_work_memo").hide();
   $("#abra_ansver").val("");
   $("#abra_ansver").focus();
  },
  
  check:function() {
    if ($("#abra_ansver").val()==this.true_ansver) {
	  this.current++;
	  if (this.current==this.test_cnt) this.done()
	  else this.gen_test();
	} else {
	 $("#abra_work_ansver").hide();
     $("#abra_work_memo").show();
	 $("#abra_is_error").show();
	 $("#abra_ansver_btn").focus();
	 this.err_cnt++;
	}
  },
  
  done:function(){
    var full_time= Math.round((this.Now()-this.start_time)/1000);
	$("#abra_result").show();
	$("#abra_control").show();
	$("#abra_work_ansver").hide();
	
	$("#abra_result").html("Длина слова "+this.word_len+
	"<p>Кол-во слов "+this.word_cnt+
	"<p>Всего тестов "+this.word_cnt+
	"<p>Ошибочных попыток "+this.err_cnt+
	"<p>Среднее кол-во попыток до правильного ответа "+Math.round(10*(this.err_cnt+this.test_cnt)/this.test_cnt)/10+
	"<p>Полное время "+full_time+
	"<p>Среднее время "+Math.round(100*full_time/this.test_cnt)/100+
	"<p>Среднее время запомин "+Math.round(100*full_time/(this.test_cnt+this.err_cnt))/100
	);
  }
  
};
abra_intf=abra;

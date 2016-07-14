
//Timer
var timer_img_slider,timer_log,timer_score;

//interval_time
var interval_time_slider=3000;
var interval_time_log=300;
var interval_time_score=3000;

//画像配列
//画像未設定
var imgPath1 = [
	{
		"path":"/*URL*/",
		"tag":"トカゲ+アップ"
	},{
		'path':"/*URL*/",
		'tag':"ハムスター+ひまわりの種"
	},{
		'path':"/*URL*/",
		'tag':"ミニチュアシュナウザー"
	},{
		'path':"/*URL*/",
		'tag':"金魚+黒"
	},{
		'path':"/*URL*/",
		'tag':"黒猫+オッドアイ"
	}
];
var imgPath_base;

//初期化
$(document).ready(function(){
	init_graf();
	//startStage();
});
var stage_num=0;
//ステージスタート
function startStage(imgPath,a){
	//stage_num++;
	if(a){
		$("#stage_id").text(stage_num)
	}else{
		$("#stage_id").text("結果");
	};

	//初期画像の設定
	setImage(imgPath);
	//IMGスライド
	init_img_silde();
	//ログファイル定期読み取り初期化
	if(a)init_log();
	//計算
	if(a)init_calcScore();

}
//画像の設定
var item_parent = ".slide";
function setImage(imgPath){
	//console.log(imgPath);
		$(item_parent).empty() ;
	for(var i=0;i<imgPath.length;i++){
		$(item_parent).append("<div class='item'><p>img:"+ (i+1) + "<br><img style='width:auto;height:600px;' src='" + imgPath[i].path + "'></div>");
	}
	imgPath_base=imgPath;
}

///////////////////
//画像表示処理
///////////////////
//画像遷移：変数を定義
var item = item_parent + " > .item";
var item_n = -1;
var item_html = [];
var item_current = 0;
var item_next = 1;
var fun_max_height = 0;
var item_num=0;
var img_i=0;
function init_img_silde(){
	item_parent = ".slide";
	item = item_parent + " > .item";
	item_n = -1;
	item_html = [];
	item_current = 0;
	item_next = 1;
	fun_max_height = 0;
	item_num=0;
	img_i=0;

	//html要素を取得・配列化
	$(item).each(function(i){
		item_html[i] =  $(this).html();
		item_html[i] = '<div class="item">' + item_html[i] + '</div>';
		item_n ++;

		//ついでに各要素の高さを取得し、最大値をmax_heightに代入
		//停止中：高さ指定
		/*this_height = "600px";//$(this).innerHeight();
		if(fun_max_height < this_height){
			fun_max_height = this_height;
		}*/
	});

	//スライドの大枠の高さを、アイテムの高さの最大値に合わせる。
	//$(item_parent).css("height",fun_max_height);

	//スライドの1つ目以外を消去
	$(item).not(":first").remove();
	next_show();

	//一定間隔でスライドさせる
	timer_img_slider = setInterval("item_slide()",  interval_time_slider);
}


//次のアイテムを出力する
function next_show() {

	if(item_current == item_n){
		item_next = 0;
	} else {
		item_next = item_current + 1;
	}
	//console.log(item_html[item_next]);
	$(item_html[item_next]).addClass("next").appendTo(item_parent).css("opacity",0);
	if(item_current == item_n){
		item_current = 0;
	} else {
		item_current ++;
	}
}

//アイテムをスライドさせる
function item_slide() {
	$(item + ":first").animate({
		"left":"-50px",
		"opacity":0
	}, 500, function(){
		$(this).remove();
	});
  $(item + ".next").animate({
		"left":"0",
		"opacity":1
	}, 500).removeClass("next");
	next_show();

	//ひとつ前の表示画像インデックス取得
	item_num = item_num + 1;
	if(item_num>imgPath_base.length){
		item_num=1;
	}
}

///////////////////
//ログファイル読み取り
///////////////////

var filepath = "";
var logs = [];
var logs_new = [];
function init_log(){
	timer_log = setInterval("getFileValue()", interval_time_log)
}
function getFileValue(){
	if(filepath){
	      // ファイル読み込みの準備（1）
	      var reader = new FileReader();
	      // ファイルの読み込みに成功したら、その内容を<div id="result">に反映（2）
	      reader.addEventListener('load', function(e) {
	        var output = reader.result;
					logs = output.split(/\r\n|\r|\n/);

					//画像表示時のログのみ取得し表示
					$("#info").empty();
					var n=0;
					logs_new = new Array(logs.length-log_end_i);
					for(var i = log_end_i ; i<logs.length; i++){
						if(logs[i]){
							logs_new[n] = logs[i].split(',')[1];
			        $("#info").text($("#info").text() + logs[i].split(',')[1]+"\n");
						}
						n++;
					}
					reGraph(logs_new)
	      }, true);
	      // ファイルの内容をテキストとして取得（3）
	      reader.readAsText(filepath, 'UTF-8');
	}
}
function getFileValue1(){
	if(filepath){
	      // ファイル読み込みの準備（1）
	      var reader = new FileReader();
	      // ファイルの読み込みに成功したら、その内容を<div id="result">に反映（2）
	      reader.addEventListener('load', function(e) {
	        var output = reader.result;
					logs = output.split(/\r\n|\r|\n/);

					//画像表示時のログのみ取得し表示
					$("#info").empty();
					var n=0;
					console.log(logs);
					log_end_i = logs.length-1;
					console.log(log_end_i );
					logs_new = new Array(logs.length-log_end_i);
					for(var i = log_end_i ; i<logs.length; i++){
						if(logs[i]){
							logs_new[n] = logs[i].split(',')[1];
			        $("#info").text($("#info").text() + logs[i].split(',')[1]+"\n");
						}
						n++;
					}
					reGraph(logs_new)
	      }, true);
	      // ファイルの内容をテキストとして取得（3）
	      reader.readAsText(filepath, 'UTF-8');
	}
}


//フォームでファイルが選択された場合
window.addEventListener('DOMContentLoaded', function() {
// ファイルが指定されたタイミングで、その内容を表示
document.querySelector("#file").addEventListener('change', function(e) {
    // File APIを利用できるかをチェック
    if (window.File) {
  	// 指定されたファイルを取得
    var input = document.querySelector('#file').files[0];
		filepath=input;
		//初期読み込み:初めの時間を取得
		getFileValue1()
		//第1ステージスタート
		startStage(imgPath1,true);
		//初めの画像表示時のインデックス読み込み
    }
  }, true);
});
var log_end_i=0;

///////////////////
//スコア計算
///////////////////
var d_max=0;
var d_i=1;
function init_calcScore(){
	d_max=0;
	d_i=1;
	//スパンを置く？
	timer_score = setInterval("calcScore()", interval_time_score);
}

function calcScore(){
	var max=0;
	console.log(d_max+","+d_i+":"+max +" "+item_num)
	for(var i =  log_end_i ; i<logs.length; i++){
		var d = logs[i].split(',')[1];
		if(max < parseInt(d)){
			max = parseInt(d);
		}
	}
	if(d_max<max){
		d_max = max;
		d_i = item_num;
	}

	log_end_i = logs.length-1;
		if(item_num>=imgPath_base.length){
			stage_end();
		}
}

//ステージ終了
function stage_end(){
		clearInterval(timer_img_slider);
		clearInterval(timer_log);
		clearInterval(timer_score);
		console.log(d_i)
		$("#graf").css("display","none");
		$.ajax({
			type: 'GET',
			url: 'https://www.googleapis.com/customsearch/v1?key=/* GoogleAPIキー */&cx=/* Google CX */&searchType=image&q='+imgPath_base[d_i-1].tag,
			dataType: 'json'
		}).done(function(json){
				var len = json.items.length;
				var imgPath = new Array(len);
				for(var i=0; i < len; i++){
					//console.log(json.items[i].link);
					imgPath[i]={
						'path': json.items[i].link,
						'tag': '猫'
					};
					//$(".ajax").append('<li><a href="'+json.items[i].link+'">'+json.items[i].title+'</a></li>');
					//$(".ajax").append('<img width="128" src="'+json.items[i].link+'"></img>');
				}
				startStage(imgPath,false);
		}).fail(function(json){
				$('.ajax').append("読み込みませんでした。");
		});
	}
	//画像からタグ検索
	var svg;
	var svgWidth = 400; // SVG領域の横幅
	var svgHeight = 300;    // SVG領域の縦幅
function init_graf(){
	var list1 = [1,10,20,30,40,50,60,70,80,90,100];
	// SVGの表示領域を生成
	svg = d3.select("#myGraph").append("svg")
	    .attr("width", svgWidth).attr("height", svgHeight)
	// 折れ線を生成
	var line = d3.svg.line()
	    .x(function(d, i){ return i * svgWidth/(list1.length-1); }) // 横方向はSVG領域に合わせて調整。データは最低2個あるのが前提
	    .y(function(d){ return (svgHeight-d*3) ; })  // 縦方向は数値そのままでスケール等しない
	// 折れ線グラフ1を描画
		svg.append("path")
	.attr("d", line(list1)) // 線を描画
	.attr("stroke-width", 3)
	.attr("stroke", "green")    // 線の色を指定
	.attr("fill", "none");  // 塗り潰しなし。指定しないと黒色で塗り潰される
	}

function reGraph(logs_new){

	if(logs_new.length>1){
		var list1 = new Array(logs_new.length-1);
		for(var i=1;i<logs_new.length-1;i++){
			list1[i-1] = logs_new[i];
		}
	    // 削除する
				//list1 = logs_new;
				var line = d3.svg.line()
				    .x(function(d, i){ return i * svgWidth/(list1.length-1); }) // 横方向はSVG領域に合わせて調整。データは最低2個あるのが前提
				    .y(function(d){ return (svgHeight-d*3) ; })  // 縦方向は数値そのままでスケール等しない
	    svg.selectAll("path").remove();
			svg.append("path")
		.attr("d", line(list1)) // 線を描画
		.attr("stroke-width", 3)
		.attr("stroke", "green")    // 線の色を指定
		.attr("fill", "none");  // 塗り潰しなし。指定しないと黒色で塗り潰される
	}
}

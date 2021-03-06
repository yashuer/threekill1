'use strict';
game.import('card',function(lib,game,ui,get,ai,_status){
	return {
		name:'zhenfa',
		card:{
			pozhenjue:{
				type:'zhenfa',
				chongzhu:true,
				enable:true,
				notarget:true,
				content:function(){
					var targets=game.filterPlayer();
					var n=targets.length;
					while(n--){
						game.swapSeat(targets.randomGet(),targets.randomGet());
					}
				},
				mode:['guozhan'],
				ai:{
					order:8,
					result:{
						player:1,
					},
				}
			},
			changshezhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(card,player){
					if(player.inline()) return true;
					if(player.identity=='unknown'||player.identity=='ye') return false;
					return game.hasPlayer(function(current){
						return current!=player&&current.isFriendOf(player);
					});
				},
				notarget:true,
				content:function(){
					if(player.inline()){
						var targets=game.filterPlayer(function(current){
							return player.inline(current);
						});
						player.line(targets);
						game.asyncDraw(targets);
					}
					else if(player.getNext()){
						var list=game.filterPlayer(function(current){
							return current!=player&&current.isFriendOf(player);
						});
						if(list.length){
							list.sort(function(a,b){
								return get.distance(player,a,'absolute')-get.distance(player,b,'absolute');
							});
							player.line(list[0]);
							game.swapSeat(list[0],player.getNext(),true,true);
						}
					}
				},
				mode:['guozhan'],
				ai:{
					order:6.5,
					result:{
						player:1,
					},
					tag:{
						draw:1
					}
				}
			},
			tianfuzhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(){
					return game.hasPlayer(function(current){
						return current.isMajor();
					});
				},
				filterTarget:function(card,player,target){
					return target.isMajor()&&target.countCards('he')>0;
				},
				selectTarget:-1,
				content:function(){
					target.chooseToDiscard('he',true).delay=false;
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:-1,
					},
					tag:{
						discard:1
					}
				}
			},
			dizaizhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(){
					return game.hasPlayer(function(current){
						return current.isNotMajor();
					});
				},
				filterTarget:function(card,player,target){
					return target.isNotMajor();
				},
				selectTarget:-1,
				content:function(){
					target.draw(false);
					target.$draw();
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:1,
					},
					tag:{
						draw:1
					}
				}
			},
			fengyangzhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:true,
				filterTarget:function(card,player,target){
					return target.sieged();
				},
				selectTarget:-1,
				content:function(){
					target.addTempSkill('feiying',{player:'damageAfter'});
					target.popup('feiying');
					game.log(target,'???????????????','????????????');
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:2,
					},
				}
			},
			yunchuizhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:true,
				filterTarget:function(card,player,target){
					return target.siege();
				},
				selectTarget:-1,
				content:function(){
					target.addTempSkill('wushuang',{source:'damageAfter'});
					target.popup('wushuang');
					game.log(target,'???????????????','????????????');
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:2,
					},
				}
			},
			qixingzhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(card,player){
					return player.siege()||player.sieged();
				},
				filterTarget:function(card,player,target){
					return target==player;
				},
				selectTarget:-1,
				content:function(){
					'step 0'
					event.targets=game.filterPlayer(function(current){
						return current.siege(player);
					});
					'step 1'
					if(event.targets.length){
						var current=event.targets.shift();
						player.line(current,'green');
						player.discardPlayerCard(current,true);
						event.redo();
					}
					'step 2'
					var card={name:'sha',isCard:true};
					var list=game.filterPlayer(function(current){
						return current.siege(player)&&player.canUse(card,current);
					});
					if(list.length){
						player.useCard(card,list,false);
					}
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:1,
					},
				}
			},
			shepanzhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(card,player){
					if(player.identity=='unknown'||player.identity=='ye') return false;
					if(get.population(player.identity)<=1) return false;
					return game.hasPlayer(function(current){
						return current!=player&&current.identity==player.identity&&!player.inline(current);
					});
				},
				notarget:true,
				content:function(){
					var targets=game.filterPlayer(function(current){
						return current.identity==player.identity;
					});
					targets.sortBySeat();
					for(var i=1;i<targets.length;i++){
						game.swapSeat(targets[i],targets[i-1].next,false);
					}
					game.log(get.translation(player.identity)+'??????????????????????????????')
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						player:1,
					},
				}
			},
			longfeizhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(card,player){
					return player.next.siege(player);
				},
				filterTarget:function(card,player,target){
					if(target.getCards('he').length==0) return false;
					return target==player.next||target==player.previous;
				},
				selectTarget:-1,
				content:function(){
					"step 0"
					player.choosePlayerCard(target,'he',true);
					"step 1"
					target.discard(result.buttons[0].link);
					"step 2"
					if(target==targets[targets.length-1]){
						player.draw();
					}
				},
				mode:['guozhan'],
				ai:{
					order:10,
					result:{
						target:-1,
						player:1
					},
				}
			},
			huyizhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:function(card,player){
					return player.siege(player.next)||player.siege(player.previous);
				},
				filterTarget:function(card,player,target){
					return player.siege(target);
				},
				selectTarget:-1,
				content:function(){
					"step 0"
					player.chooseCard('?????????????????????????????????'+get.translation(target)+'??????','he',function(card){
						return get.type(card)!='basic';
					}).ai=function(card){
						if(get.effect(target,{name:'sha'},player,player)>0){
							return 6-get.value(card);
						}
						return 0;
					};
					"step 1"
					if(result.bool){
						player.useCard({name:'sha'},result.cards,target,false);
					}
					"step 2"
					if(target==player.next) event.player2=player.next.next;
					else event.player2=player.previous.previous;
					event.player2.chooseCard('?????????????????????????????????'+get.translation(target)+'??????','he',function(card){
						return get.type(card)!='basic';
					}).ai=function(card){
						if(get.effect(target,{name:'sha'},event.player2,event.player2)>0){
							return 6-get.value(card);
						}
						return 0;
					};
					"step 3"
					if(result.bool){
						event.player2.useCard({name:'sha'},result.cards,target,false);
					}
				},
				mode:['guozhan'],
				ai:{
					order:7,
					result:{
						target:-2,
					},
				}
			},
			niaoxiangzhen:{
				type:'zhenfa',
				chongzhu:true,
				enable:true,
				filterTarget:function(card,player,target){
					if(player.identity==target.identity) return false;
					if(target.identity=='unknown'||target.identity=='ye') return false;
					return target.identity==target.next.identity||target.identity==target.previous.identity
				},
				selectTarget:-1,
				content:function(){
					"step 0"
					var next=target.chooseToRespond({name:'shan'});
					next.ai=function(card){
						if(get.damageEffect(target,player,target)>=0) return 0;
						return 1;
					};
					next.autochoose=lib.filter.autoRespondShan;
					"step 1"
					if(result.bool==false){
						target.damage();
					}
				},
				ai:{
					basic:{
						order:9,
						useful:1
					},
					result:{
						target:-1.5,
					},
					tag:{
						respond:1,
						respondShan:1,
						damage:1,
					}
				},
				mode:['guozhan'],
			},
		},
		skill:{

		},
		translate:{
			zhenfa:'??????',
			changshezhen:'?????????',
			pozhenjue:'?????????',
			tianfuzhen:'?????????',
			dizaizhen:'?????????',
			fengyangzhen:'?????????',
			yunchuizhen:'?????????',
			qixingzhen:'?????????',
			shepanzhen:'?????????',
			shepanzhen_bg:'???',
			yunchuizhen_bg:'???',
			longfeizhen:'?????????',
			huyizhen:'?????????',
			niaoxiangzhen:'?????????',
			niaoxiangzhen_info:'???????????????????????????????????????????????????????????????????????????????????????',
			qixingzhen_info:'???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
			// longfeizhen_info:'?????????????????????????????????????????????????????????',
			// qixingzhen_info:'???????????????????????????????????????',
			// shepanzhen_info:'???????????????????????????????????????',
			// yunchuizhen_info:'???????????????????????????????????????????????????????????????????????????',
			// fengyangzhen_info:'??????????????????????????????????????????????????????????????????????????????',
			dizaizhen_info:'?????????????????????????????????',
			changshezhen_info:'?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
			// pozhenjue_info:'????????????????????????????????????',
			tianfuzhen_info:'????????????????????????????????????'
		},
		list:[
			["diamond",1,'changshezhen'],
			["club",1,'changshezhen'],
			// ["spade",1,'changshezhen'],
			// ["heart",1,'changshezhen'],

			["diamond",2,'tianfuzhen'],
			// ["club",2,'tianfuzhen'],
			["spade",2,'tianfuzhen'],
			["heart",2,'tianfuzhen'],

			["diamond",3,'dizaizhen'],
			// ["club",3,'dizaizhen'],
			["spade",3,'dizaizhen'],
			["heart",3,'dizaizhen'],

			// ["diamond",4,'fengyangzhen'],
			// ["club",4,'fengyangzhen'],
			// ["spade",4,'fengyangzhen'],
			// ["heart",4,'fengyangzhen'],

			// ["diamond",5,'zhonghuangzhen'],
			// ["club",5,'zhonghuangzhen'],
			// ["spade",5,'zhonghuangzhen'],
			// ["heart",5,'zhonghuangzhen'],

			// ["diamond",6,'huyizhen'],
			// ["club",6,'huyizhen'],
			// ["spade",6,'huyizhen'],
			// ["heart",6,'huyizhen'],

			["diamond",7,'qixingzhen'],
			["club",7,'qixingzhen'],
			["spade",7,'qixingzhen'],
			// ["heart",7,'qixingzhen'],

			// ["diamond",8,'shepanzhen'],
			// ["club",8,'shepanzhen'],
			// ["spade",8,'shepanzhen'],
			// ["heart",8,'shepanzhen'],

			// ["diamond",9,'longfeizhen'],
			// ["club",9,'longfeizhen'],
			// ["spade",9,'longfeizhen'],
			// ["heart",9,'longfeizhen'],

			["diamond",11,'niaoxiangzhen'],
			// ["club",11,'niaoxiangzhen'],
			["spade",11,'niaoxiangzhen'],
			["heart",11,'niaoxiangzhen'],

			// ["diamond",12,'yunchuizhen'],
			// ["club",12,'yunchuizhen'],
			// ["spade",12,'yunchuizhen'],
			// ["heart",12,'yunchuizhen'],

			// ["diamond",13,'pozhenjue'],
			// ["club",13,'pozhenjue'],
			// ["spade",13,'pozhenjue'],
			//["heart",13,'pozhenjue'],
		],
	};
});

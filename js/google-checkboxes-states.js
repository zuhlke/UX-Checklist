
			$(document).ready(function(){
				$("#checklist-form").garlic();
				$("#print").on('click', function(){
					ga('send', 'event', 'print', 'click', 'print');
					window.print();
				});
				$("#reset").on('click', function(){
					ga('send', 'event', 'reset', 'click', 'reset');
					$('input:checkbox').each(function() {
						$(this).prop('checked', false);
					});
					$("#checklist-form").garlic('destroy');
				});
				$("#footer a").on('click', function(e){
					var elm = e.currentTarget;
					ga('send', 'event', 'footer', $(elm).attr('title'));
				});
				$("input:checkbox").on('change', function(e){
					var cb = $(this);
					var id = cb.attr('id');
					var isChecked = cb.is(':checked');
					ga('send', 'event', {
						'eventCategory': 'checkbox',
						'eventAction': isChecked ? 'set' : 'clear',
						'eventLabel': id
					});
				});
				$('.open-popup-link').magnificPopup({
					type:'inline',
					midClick: true,
					callbacks: {
						open: function() {
							ga('send', 'event', 'popup', 'open', $(this.content).attr('id'));
						},
						close: function() {
							ga('send', 'event', 'popup', 'close', $(this.content).attr('id'));
						}
					}
				});
			});
			realtime api
			var checkboxes = {};
			var view = null;
			var controller = null;
			$().ready(function(){
				var isFn = function(id, e) { return $(e).is(':checked'); };
				var setFn = function(id, e, val) {
					$(e).prop('checked', val);
					$(e).garlic('persist');
				};
				$('input:checkbox').each(function() {
					var id = $(this).attr('id');
					checkboxes[id] = new Realtime.Model.CheckBox(id, this, isFn, setFn);
				});
				view = new Realtime.View(checkboxes);
				var cb = view.checkboxes;
				console.log(cb);
				controller = new Realtime.Controller(view);
				gapi.load("auth:client,drive-realtime,drive-share", function () {
					controller.init();
					$('form').on('change', 'input:checkbox', function(ev){
						console.log(ev);
						controller.onCheckBoxChange($(ev.target).attr('id'));
					});
					var signinSuccess = function() {
						$('#signin-do').hide();
						$('#signin-fail').hide();
						$('#signin-success').show();
						$("#reset").on('click', function(){
							controller.save();
						});
					};
					var signinFailed = function() {
						$('#signin-fail').show();
					};
					controller.auth(true,
						signinSuccess,
						function(){$('#signin-do').show();}
					);
					$('#signin').on('click', function(){
						controller.auth(false, signinSuccess, signinFailed);
					});
				});
			});

<table class="gvt-choicepage" aria-describedby="government choice form">
	<tr>
		<td colspan="3" class="gvt-header">
			<?= GVT_WELCOME.' '.$userData['user_name']. ' ! '.GVT_WELCOME_2 ?>
		</td>
	</tr>
	<tr>
		<td class="gvt-choosecard">
			<h1><?= GVT_PRESIDENT ?></h1>
			<div>
				<img src="<?= $cdnURL ?>img/ui/wip.svg" alt="Work in progress" />
				<p><?= GVT_PRESIDENT_DESC ?></p>
			</div>
			<span id="choosebtn1" class="gvt-choosebtn ui-medium-button gvt-choosebtn-nextButton"><?= GVT_CHOOSE.GVT_PRESIDENT.' !' ?></span>
		</td>
		<td class="gvt-choosecard">
			<h1><?= GVT_CEO ?></h1>
			<div>
				<img src="<?= $cdnURL ?>img/ui/wip.svg" alt="Work in progress" />
				<p><?= GVT_CEO_DESC ?></p>
			</div>
			<span id="choosebtn2" class="gvt-choosebtn ui-medium-button gvt-choosebtn-nextButton"><?= GVT_CHOOSE.GVT_CEO.' !' ?></span>
		</td>
		<td class="gvt-choosecard">
			<h1><?= GVT_EMPEROR ?></h1>
			<div>
				<img src="<?= $cdnURL ?>img/ui/wip.svg" alt="Work in progress" />
				<p><?= GVT_EMPEROR_DESC ?></p>
			</div>
			<span id="choosebtn3" class="gvt-choosebtn ui-medium-button gvt-choosebtn-nextButton"><?= GVT_CHOOSE.GVT_EMPEROR.' !' ?></span>
		</td>
	</tr>

	<tr><td colspan="3" class="gvt-footer"> <span id="gvt-confbtn" class="ui-large-button"><?= GVT_BEGIN ?></span></td></tr>
</table>

<form method="post" action="index.php" id="choose">
	<input type="hidden" value="-1" id="choice" name="choice">
</form>

<script type="text/javascript">
	window.addEventListener('load', () => {
		const choice = document.getElementById('choice');
		const choice1 = document.getElementById('choosebtn1');
		const choice2 = document.getElementById('choosebtn2');
		const choice3 = document.getElementById('choosebtn3');
		const confirm = document.getElementById('gvt-confbtn');
		const form = document.getElementById('choose');

		function setActive(chx) {
			choice1.className = 'gvt-choosebtn ui-medium-button';
			choice2.className = 'gvt-choosebtn ui-medium-button';
			choice3.className = 'gvt-choosebtn ui-medium-button';

			switch(chx) {
				case 1:
					choice1.className = 'gvt-choosebtn ui-medium-button ui-medium-button-active';
					choice.value = chx;
				break;
				case 2:
					choice2.className = 'gvt-choosebtn ui-medium-button ui-medium-button-active';
					choice.value = chx;
				break;
				case 3:
					choice3.className = 'gvt-choosebtn ui-medium-button ui-medium-button-active';
					choice.value = chx;
				break;
				default:
					// Do Nothing
			}

			confirm.className = 'ui-large-button gvt-choosebtn-nextButton'
		}

		choice1.addEventListener('click',function() { setActive(1); });
		choice2.addEventListener('click',function() { setActive(2); });
		choice3.addEventListener('click',function() { setActive(3); });

		confirm.addEventListener('click',function() {
			form.submit();
		});
	});
</script>
</body>
<?php /* Block Portrait Screens */ include(DIR_VIEW.'/portraitWarn.php');
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
  <meta name="author" content="Zangaphee Chimombo" />
  <meta name="keywords" content="bawo, bao, omweso, mancala, manqala, mankala,
      game, african board game, count and capture game, java game, oware,
      board game, owari, awele, warri, awale, auale, wari, ncombwa" />
  <meta name="description" content="BAWO - Simple Perplexity" />
  <title>BAWO - Simple Perplexity</title>
  <link type="text/css" rel="stylesheet" href="bawo.css" />
</head>

<body>
<br />
<table>
<tr><th>BAWO - Simple Perplexity</th></tr>

<tr><td class="right">
<b>[&nbsp;bawo&nbsp;&middot;</b>
&nbsp;<a href="shop.html">shop</a>&nbsp;<b>&middot;</b>
&nbsp;<a href="howto.html">howto</a>&nbsp;<b>&middot;</b>
&nbsp;<a href="http://www.gamecabinet.com/rules/Bao.html">rules</a>&nbsp;<b>&middot;</b>
&nbsp;<a href="FAQ.html">faq</a>&nbsp;<b>&middot;</b>
&nbsp;<a href="links.html">links</a>&nbsp;<b>&middot;</b>
&nbsp;<a href="http://bawo.svn.sourceforge.net/viewvc/bawo/">source</a>&nbsp;<b>&middot;</b>
&nbsp;<a href="http://www.gnu.org/copyleft/gpl.html">licence</a>&nbsp;<b>&middot;</b>
&nbsp;<a href="mailto:bawo AT zombasoft DOT com">mail@me</a>&nbsp;<b>]</b>
</td></tr>

<tr><td class="center">
<br /><br />
<applet code="Bawo.class" archive="Bawo.jar" width="560" height="400" align="middle">
</applet>
</td></tr>

<tr><td class="left">
<br /><br />
<i>bawo</i> is the Malawian version of an ancient African board game based around a simple counting apparatus. <i>bawo</i> (Malawi), <i>bao</i> (Tanzania) and <i>omweso</i> (Uganda) belong to the globally prevalent (spread by the African diaspora) <i>mancala</i> group of "count and capture" board games, the more complex (four-rank) of which are played in Bantu Africa. <i>bawo</i> was played in some form in Kamit, "the land of blacks", ancient Egypt, and has even retained this name.
<br /><br />
although the apparatus required is simple (several holes in the ground and seeds of common trees suffice), <i>bawo</i> is as complex as checkers and even chess, sometimes. hence the subtitle: Simple Perplexity. join the mancalagames yahoo group for more information and an online community.
<br /><br />
jBawo 1.0 is a java program which allows single-user (against the computer) or dual-user playing of bawo via an internet browser or personal computer with Java installed.
<br /><br />
there are many variations in the rules. the ones that apply in this applet are
detailed <a href="http://www.gamecabinet.com/rules/Bao.html"
><b>here</b></a>. 
the one difference is in the initial setup for the advanced <i>yokhoma</i>
mode of playing.
<br /><br />
learners are advised to familiarise themselves with the novice <i>yawana</i> ("for kids") mode of playing b4 trying the advanced <i>yokhoma</i> ("of knocking" from the sound one makes when sowing a token in a bowl).
<br /><br />
if there's white space above instead of an 8by4 matrix of circles then Java is probably not enabled in your browser.
<br /><br />
this may be remedied in Mozilla Firefox by installing the Java Plug-In.
<br /><br />
this site's mirrored at <a href="http://bawo.sourceforge.net"
><b>http://bawo.sourceforge.net</b></a>.
there's also a project page at <a href="http://sourceforge.net/projects/bawo"
><b>http://sourceforge.net/projects/bawo</b></a>.
<br /><br />
</td></tr>

<tr><td class="right">
<p>
    <a href="http://jigsaw.w3.org/css-validator/check/referer">
        <img style="border:0;width:88px;height:31px"
            src="http://jigsaw.w3.org/css-validator/images/vcss"
            alt="Valid CSS!" />
    </a>
</p>
</td></tr>

</table>

<table class="footer">
<tr><td class="footer left">
(c) 2000-2011, bawo AT zombasoft DOT com
</td>

<td class="footer right">
visits since last update on 08/12/11:

<?php
$fptr=fopen("cnt.txt","r");
$count=fgets($fptr,1024);
fclose($fptr);
$fptr=fopen("cnt.txt","w");
$count=$count+1;
$temp=fputs($fptr,$count);
echo "$count";
fclose($fptr);
?>

</td></tr>
</table>

</body>
</html>


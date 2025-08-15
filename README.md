<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Passcode Unlock</title>
<style>
  :root{
    --bg1:#ff9a9e; --bg2:#fecfef;
    --heart1:#ff9aa2; --heart2:#ff6f91;
    --cta:#ff6f61; --ctaHover:#e85c50;
    --glass:rgba(255,255,255,.15);
  }
  body{
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: linear-gradient(135deg, var(--bg1), var(--bg2));
    color:#fff; margin:0; text-align:center;
    overflow-x: hidden; /* Prevent horizontal scroll */
  }
  .container{ 
    max-width:520px; 
    margin:auto; 
    padding:20px;
    position: relative;
    min-height: 100vh;
  }

  /* Section styling */
  section {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
    pointer-events: none;
  }
  section.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
    z-index: 10;
  }
  section.hidden {
    display: none;
  }

  /* Dots for quick feedback (shows how many digits entered) */
  .dots{ display:flex; justify-content:center; gap:8px; margin:10px 0 18px }
  .dot{ width:12px; height:12px; border-radius:50%; background:rgba(255,255,255,.35); transition:background .2s }
  .dot.filled{ background:#fff }

  /* Readonly pass display (so you can see the digits if needed) */
  #passcode{
    width: 80%; max-width: 340px; text-align:center;
    font-size:18px; padding:10px 12px; border:none; border-radius:10px;
    background: var(--glass); color:#fff; letter-spacing:2px;
  }

  /* Heart keypad */
  .keypad{
    display:grid; grid-template-columns:repeat(3,82px);
    gap:14px; justify-content:center; margin:18px auto 8px;
  }
  .heart{
    width:78px; height:78px; border:none; cursor:pointer;
    background: radial-gradient(circle at 30% 30%, var(--heart1), var(--heart2));
    color:#fff; font-weight:700; font-size:22px;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 6px 12px rgba(0,0,0,.25);
    transition: transform .08s ease, box-shadow .08s ease, filter .2s ease;
    /* widely-supported heart shape */
    clip-path: polygon(
      50% 15%, 61% 7%, 75% 7%, 85% 15%,
      85% 28%, 50% 65%,
      15% 28%, 15% 15%, 25% 7%, 39% 7%
    );
  }
  .heart:active{ transform: scale(.92); box-shadow:0 3px 6px rgba(0,0,0,.35); }
  .sub{ font-size:20px; }

  /* NEW — Choose screen (cards + animated hearts background) */
  #choose-section{
    position: relative;
    min-height: calc(100vh - 160px); /* fill screen nicely within container padding */
    display: none; /* toggled by JS */
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 22px;
  }
  #choose-section h2{ margin-top: 4px; }

  /* floating hearts bg just for choose screen */
  .hearts-bg {
    position:absolute; inset:0; overflow:hidden; z-index:0; pointer-events:none;
    opacity:.25;
  }
  .hearts-bg .h {
    position:absolute; font-size:28px; animation: floatUp 8s linear infinite;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,.25));
  }
  .hearts-bg .h:nth-child(1){ left:10%; bottom:-10%; animation-duration: 9s; font-size:30px; }
  .hearts-bg .h:nth-child(2){ left:70%; bottom:-12%; animation-duration: 10s; font-size:36px; }
  .hearts-bg .h:nth-child(3){ left:40%; bottom:-15%; animation-duration: 8.5s; font-size:26px; }
  .hearts-bg .h:nth-child(4){ left:85%; bottom:-18%; animation-duration: 11s; font-size:32px; }
  .hearts-bg .h:nth-child(5){ left:25%; bottom:-14%; animation-duration: 9.5s; font-size:28px; }
  @keyframes floatUp {
    0%   { transform: translateY(0) scale(1); opacity:.9; }
    80%  { opacity:.9; }
    100% { transform: translateY(-120%) scale(1.05); opacity:0; }
  }

  /* Card-style options (big, readable, vertical) */
  .choose-container{
    position:relative; z-index:1; /* above floating hearts */
    width:100%;
    display:flex; flex-direction:column; align-items:center; gap:18px;
    margin-top: 6px;
  }
  .choose-option{
    width: 92%;
    max-width: 360px;
    padding: 18px 16px 20px;
    border-radius: 18px;
    text-align:center;
    background: rgba(255,255,255,0.18);
    border: 2px solid rgba(255,255,255,0.35);
    backdrop-filter: blur(8px);
    cursor: pointer;
    /* no hover/tap animations per your request */
  }
  .choose-option span.icon{
    font-size: 2.4rem;
    display:block;
    margin-bottom: 8px;
    text-shadow: 0 2px 6px rgba(0,0,0,.3);
  }
  .choose-option p{
    margin:0;
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing:.2px;
    color:#fff;
    text-shadow: 0 2px 6px rgba(0,0,0,.35);
  }

  /* Glass card */
  .card{
    background: var(--glass);
    border-radius:16px; padding:16px; backdrop-filter: blur(6px);
    box-shadow:0 8px 18px rgba(0,0,0,.15);
  }

  /* Message & audio sections */
  .message-container{
    text-align:left; white-space:pre-wrap; line-height:1.55;
    max-height:60vh; overflow:auto; padding:16px; border-radius:14px;
    background: rgba(255,255,255,.12); color:#fff; font-size:16px;
  }

  /* Back button (heart) */
  .back{
    margin:16px auto 0; width:64px; height:64px;
    clip-path: polygon(
      50% 15%, 61% 7%, 75% 7%, 85% 15%,
      85% 28%, 50% 65%,
      15% 28%, 15% 15%, 25% 7%, 39% 7%
    );
    background: radial-gradient(circle at 30% 30%, var(--heart1), var(--heart2));
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-weight:900; border:none; cursor:pointer;
    box-shadow:0 6px 12px rgba(0,0,0,.25); transition: transform .1s ease;
  }
  .back:active{ transform: scale(.92); }

  select, audio{
    margin-top:12px; width:100%; max-width:360px;
  }

  /* Small helpers */
  h2{ margin:8px 0 12px; text-shadow:0 1px 3px rgba(0,0,0,.25); }
  .hint{ opacity:.9; font-size:14px; margin-top:6px }
</style>
</head>
<body>
  <div class="container">

    <!-- PASSCODE -->
    <section id="passcode-section" class="active">
      <h2>🔒 Enter Passcode</h2>

      <!-- live dots -->
      <div class="dots" id="dots">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>

      <!-- readonly display so user can see digits if desired -->
      <input id="passcode" type="password" placeholder="••••••" readonly />

      <div class="keypad" aria-label="Keypad">
        <button class="heart" onclick="tap('1')">1</button>
        <button class="heart" onclick="tap('2')">2</button>
        <button class="heart" onclick="tap('3')">3</button>
        <button class="heart" onclick="tap('4')">4</button>
        <button class="heart" onclick="tap('5')">5</button>
        <button class="heart" onclick="tap('6')">6</button>
        <button class="heart" onclick="tap('7')">7</button>
        <button class="heart" onclick="tap('8')">8</button>
        <button class="heart" onclick="tap('9')">9</button>
        <button class="heart sub" onclick="del()" aria-label="Delete">⌫</button>
        <button class="heart" onclick="tap('0')">0</button>
        <button class="heart sub" onclick="submitCode()" aria-label="Enter">✔</button>
      </div>
      <div class="hint">Passcode is 6 digits</div>
    </section>

    <!-- CHOOSE -->
    <section id="choose-section">
      <h2> What would you like to open first baby? 😚</h2>

      <!-- animated hearts background -->
      <div class="hearts-bg" aria-hidden="true">
        <div class="h">❤</div>
        <div class="h">❤</div>
        <div class="h">❤</div>
        <div class="h">❤</div>
        <div class="h">❤</div>
      </div>

      <!-- large, readable options -->
      <div class="choose-container">
        <div class="choose-option" onclick="openMessage()">
          <span class="icon">📩</span>
          <p>Read the Message</p>
        </div>
        <div class="choose-option" onclick="openAudio()">
          <span class="icon">🎵</span>
          <p>Play the Audio</p>
        </div>
      </div>
    </section>

    <!-- MESSAGE -->
    <section id="message-section">
      <h2>💌 Special Message</h2>
      <div class="card">
        <div class="message-container" id="letter">
Hi babyyy. Happy anniversary, mahal, one year na pala tayo. Grabe, parang ang bilis pero at the same time parang sobrang tagal na din tayong together. Alam mo ba, kanina habang nag-iisip ako kung ano isusulat ko sayo, napangiti lang ako kasi naalala ko lahat ng mga nangyari satin this past year. Yung mga tawanan natin sa call and just having fun with each others presence, yung mga away natin na akala mo end of the world na, tapos kinabukasan okay na ulit tayo. Yung mga times na naiyak ako kasi namiss kita. It's so hard sa LDR, minsan okay lang na malayo tayo kasi sanay na, tapos may mga araw na biglang sasakit yung chest because we just wanna see each other in personm. Pero alam mo yung napansin ko? Kahit ganon, hindi tayo umayaw. Hindi tayo umayaw. Kasi alam natin na worth it naman eh. Actually, nasanay na ako sa presence mo sa phone ko na minsan nagugulat ako pag wala kang message. Parang may kulang sa araw ko pag hindi kita nakausap. Ang dami nating na feel  this year ha. Yung mga times na pareho tayong stressed sa school/work pero nandyan pa din tayo para sa isa't isa. Yung mga gabi na napupuyat ako kasi ayaw ko pa matulog cause I want to spend more time with you. Yung mga araw na bad mood ako pero pag nag usap na tao every bad feeling is being relieve, nawala na lahat. Hindi naman perfect yung relationship natin. May mga times na nag aaway tayo because of misunderstandings, or minsan dahil lang sa mood swings natin. May mga moments na napapaisip ako kung kaya ba natin to, especially pag sobrang hirap ng LDR. Pero you know what? After every fight, lagi naman tayong bumabalik sa isa't isa. Lagi naman natin napag uusapan. And that says a lot about us, diba? I love na kahit malayo tayo, you still make an effort to be part of my day. Yung mga pictures mo ng food na kinakain mo, yung mga random stuff na nakita mo, yung mga voice messages mo na pinapakinggan ko ulit-ulit. Mga simple things pero grabe yung impact sakin. Minsan naiisip ko, I'm so lucky because you choose me out of all the people na nag ccourt sayo and more better than me. Sa lahat ng pwedeng mangyari, sa lahat ng tao na pwede kong makilala, ikaw yung naging girlfriend ko. Ikaw pa yung naging best friend ko. Ikaw pa yung naging home ko kahit nasa malayo ka. You changed me in the best way possible, babyy. Before you, hindi ako marunong mag compromise masyado, medyo selfish ako sa time ko. Pero ngayon, kahit anong ginagawa ko, naiisip ko kung paano ka kasama dun. Pag may good news ako, ikaw una kong naiisip na balitaan. Pag may problem ako, ikaw una kong takbuhan but sorry po cause minsan sa problems is not totally sanay pero to be honest baby, sayo lang me nagging ganto, for the the very first time in my life. Alam mo yung mga dreams ko dati para sa sarili ko? ngayon lahat yun, kasama ka na. Hindi na ako nag pplano ng future na wala ka. Kasi honestly, I can't imagine my life without you na. I know mahirap pa din yung LDR setup natin. Hindi pa natin alam kailan tayo magiging together for real. Pero you know what I realized? Kahit mahirap, okay lang. Kasi ikaw naman yung kasamahan ko sa hirap na to. And I trust na aabutin din natin yung time na magiging okay na lahat. For now, okay na sakin na makausap ka everyday and kapag wla ikaw na bantay is we'll call and feel each others presence and be happy, I'm okay na sa voice messages lang ang kiss mo. I'm okay with it na sa chat lang kita masasabi na I love you. Kasi alam ko naman na totoo yung feelings natin para sa isa't isa. Thank you for staying babyyy. Thank you for choosing us every single day. Thank you for being patient with me when I'm being makulit or demanding. Thank you for being so understanding and loving. Most of all, thank you for loving me kahit malayo tayo. Hindi madali yung ginagawa natin, pero ginagawa natin kasi we love each other. And that means everything to me. Happy anniversary again, babyyy koooo. Here's to one year of loving each other across the miles. Here's to all the calls pa na gagawin natin, all the messages pa na magse-send tayo, and all the times pa na mag-aantay tayo sa isa't isa. I love you my prettyyy babyyy. Sobra. Like, sobra talang sobra. Minsan nga I'm scared na baka masama na yung pagmamahal ko sayo eh HAHAHAHAH, cause I'm so clingy and obsessed with my prettyyy babyyy. Pero hindi ko mapigil e. Can't wait for our 2nd anniversary. Hopefully by then, nandyan ka na sa tabi ko in person. 😚
I LOVE YOUUUUUUU SO MUCHHHHH!! 😚😚😚😚😚😚
        </div>
        <button class="back" onclick="backToChoose()" title="Back">↩</button>
      </div>
    </section>

    <!-- AUDIO -->
    <section id="audio-section">
      <h2>🎵 Choose a Song</h2>
      <div class="card">
        <select id="songSelect" onchange="playSong()">
          <option value="">-- Select a song --</option>
          <option value="song1.mp3">Song 1</option>
          <option value="song2.mp3">Song 2</option>
        </select>
        <audio id="audioPlayer" controls></audio>
        <button class="back" onclick="backToChoose()" title="Back">↩</button>
      </div>
    </section>

  </div>

<script>
  const correctPasscode = "082124";
  let code = "";
  let currentSection = "passcode-section";

  function showSection(sectionId) {
    // Hide current section with animation
    const current = document.getElementById(currentSection);
    current.classList.remove('active');
    
    // Show new section with animation after a small delay
    setTimeout(() => {
      current.classList.add('hidden');
      const next = document.getElementById(sectionId);
      next.classList.remove('hidden');
      
      // Force reflow to trigger animation
      void next.offsetWidth;
      
      next.classList.add('active');
      currentSection = sectionId;
    }, 200);
  }

  function refreshDots(){
    const dots = document.querySelectorAll(".dot");
    dots.forEach((d,i)=> d.classList.toggle("filled", i < code.length));
  }

  function tap(d){
    if(code.length < 6){
      code += d;
      document.getElementById("passcode").value = code;
      refreshDots();
      if(code.length === 6){ submitCode(); }
    }
  }

  function del(){
    code = code.slice(0,-1);
    document.getElementById("passcode").value = code;
    refreshDots();
  }

  function submitCode(){
    if(code === correctPasscode){
      showSection("choose-section");
      // Ensure choose section is flex
      document.getElementById("choose-section").style.display = "flex";
    }else{
      alert("❌ Incorrect passcode. Try again.");
      code = "";
      document.getElementById("passcode").value = "";
      refreshDots();
    }
  }

  function openMessage(){
    showSection("message-section");
  }

  function openAudio(){
    showSection("audio-section");
  }

  function backToChoose(){
    showSection("choose-section");
  }

  function playSong(){
    const player = document.getElementById("audioPlayer");
    const file = document.getElementById("songSelect").value;
    if(file){ player.src = file; player.play(); }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    // Hide all sections except the first one
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      if(section.id !== 'passcode-section') {
        section.classList.add('hidden');
      }
    });
    refreshDots();
  });
</script>
</body>
</html>

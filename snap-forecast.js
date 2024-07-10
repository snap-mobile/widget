class SnapForecast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    var linkNode = document.createElement("link");
    linkNode.type = "text/css";
    linkNode.rel = "stylesheet";
    linkNode.href = "https://fonts.googleapis.com/css?family=Inter:wght@100..900&display=swap";
    document.head.appendChild(linkNode);

    // CSS for the modal
    const style = document.createElement('style');
    style.textContent = `
          :host {
              display: block;
              font-family: "Inter", sans-serif;
          }
          .modal {
              background: #4980EC;
              color: #fff;
              display: flex;
              overflow: hidden;
              flex-direction: row;
              flex-wrap: no-wrap;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              width: 400px;
              padding: 30px;
              margin: 30px;
          }
          .calculator {
            width: 100%;
            flex: 0 0 100%;
            flex-direction: column;
            display: flex;
            margin-left: 0px;
            transition: margin-left 200ms ease-in-out;
            }
          .selector-options {
            width: 100%;
            flex-wrap: wrap;
            display: flex;
            flex: 0 0 100%;
            margin-left: 60px;
            align-content: flex-start;
            align-items: flex-start;
            height: 450px;
            overflow-y: scroll;
          }
          .selector-options span {
            cursor: pointer;
          }
          .selector-options .st {
            padding: 10px 5px;
            text-align: center;
            width: 50px;
            margin: 10px 10px;
            border-radius: 5px;
            color: #4980EC;
            font-weight: 800;
            font-size: 20px;
            background-color: #fff;
          }
          .selector-options .prog {
            padding: 20px 5px;
            text-align: center;
            display: flex;
            align-items: center;
            align-content: center;
            justify-content: center;
            height: 30px;
            width: 170px;
            margin: 10px 10px;
            border-radius: 5px;
            color: #4980EC;
            font-weight: 800;
            font-size: 20px;
            background-color: #fff;
          }
          .logo-header {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              margin-bottom: 20px;
          }
          .logo-header h2 {
              font-size: 23px;
              color: #B0D4FF;
              font-family: sans-serif;
              font-weight: 900;
              text-transform: uppercase;
              margin: 0;
          }
          .logo-header img {
              width: 49px;
              height: 40px;
          }
          .main-header {
          }
          .main-header h2 {
            font-size: 35px;
            font-weight: 100;
            text-align: center;
            margin: 10px 0;
          }
          .main-header .big-number {
            margin: 10px 0;
            font-size: 60px;
            font-weight: 800;
            letter-spacing: 2px;
            text-align: center;
          }
          .main-header .big-number::before {
            content: "$";
          }
          .estimate-controls {
          }
          .estimate-info {
            text-align: center;
            font-size: 18px;
          }
          .estimate-info .program {
            text-decoration: underline;
            cursor: pointer;
          }
          .estimate-info .program::before {
            content: "▼ ";
            font-size: 10px;
            display: inline-block;
            margin-right: 5px;
            line-height: 20px;
            vertical-align: top;
          }
          .slide-container {
            padding: 10px 0px;
          }
          .slider {
            -webkit-appearance: none;
            width: 100%;
            height: 5px;
            border-radius: 5px;
            background: #8EBEF8;
            outline: none;
            opacity: 1;
            -webkit-transition: .2s;
            transition: opacity .2s;
          }
          .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #FFFFFF;
            cursor: pointer;
          }
          .slider::-moz-range-thumb {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #FFFFFF;
            cursor: pointer;
          }
          .location-selector {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .location {
            border: 1px solid white;
            border-radius: 50px;
            padding: 10px 40px;
            cursor: pointer;
          }
          .location::before {
            content: "▼ ";
            font-size: 10px;
            display: inline-block;
            margin-right: 5px;
            line-height: 20px;
            vertical-align: top;
          }
          .cta {
            font-family: sans-serif;
            color: #050505;
            text-decoration: none;
            background-color: #53FF83;
            padding: 20px 40px;
            width: 300px;
            text-align: center;
            font-size: 25px;
            font-weight: 900;
            border-radius: 80px;
            margin: 10px auto;
          }
      `;

    // HTML for the modal
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="modal">
          <div class="calculator">
            <div class="logo-header">
              <h2>Raise with</h2>
              <img src="data:image/png;base64,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" alt="raise logo">
            </div>
            <div class="main-header">
              <h2>You could earn</h2>
              <h1 class="big-number">${this.rpk(27, 8, 20)}</h1>
            </div>
            <div class="estimate-controls">
              <p class="estimate-info">
                <span class="program">Basketball</span>
                <span class="info">program with</span>
                <span class="participant-count">20</span>
                <span class="info">participants</span>
              </p>
            </div>
            <div class="slide-container">
              <input type="range" min="5" max="100" step="5" value="20" class="slider" id="participant-val">
            </div>
            <div class="location-selector">
              <p class="location">North Carolina</p>
            </div>
            <a href="https://snapraise.com/connect-with-us/" class="cta">
              Start Your Fundraiser
            </a>
          </div>
          <div id="state-options" class="selector-options" style="display:none">
            <input type="hidden" id="state-val" name="state-val" value="27" />
            <span class="st" value="0" display-name="Alaska">AK</span>
            <span class="st" value="1" display-name="Alabama">AL</span>
            <span class="st" value="2" display-name="Arkansas">AR</span>
            <span class="st" value="3" display-name="Arizona">AZ</span>
            <span class="st" value="4" display-name="California">CA</span>
            <span class="st" value="5" display-name="Colorado">CO</span>
            <span class="st" value="6" display-name="Connecticut">CT</span>
            <span class="st" value="7" display-name="Washington D.C.">DC</span>
            <span class="st" value="8" display-name="Delaware">DE</span>
            <span class="st" value="9" display-name="Florida">FL</span>
            <span class="st" value="10" display-name="Georgia">GA</span>
            <span class="st" value="11" display-name="Hawaii">HI</span>
            <span class="st" value="12" display-name="Iowa">IA</span>
            <span class="st" value="13" display-name="Idaho">ID</span>
            <span class="st" value="14" display-name="Illinois">IL</span>
            <span class="st" value="15" display-name="Indiana">IN</span>
            <span class="st" value="16" display-name="Kansas">KS</span>
            <span class="st" value="17" display-name="Kentucky">KY</span>
            <span class="st" value="18" display-name="Louisiana">LA</span>
            <span class="st" value="19" display-name="Massachusetts">MA</span>
            <span class="st" value="20" display-name="Maryland">MD</span>
            <span class="st" value="21" display-name="Maine">ME</span>
            <span class="st" value="22" display-name="Michigan">MI</span>
            <span class="st" value="23" display-name="Minnesota">MN</span>
            <span class="st" value="24" display-name="Missouri">MO</span>
            <span class="st" value="25" display-name="Mississippi">MS</span>
            <span class="st" value="26" display-name="Montana">MT</span>
            <span class="st" value="27" display-name="North Carolina">NC</span>
            <span class="st" value="28" display-name="North Dakota">ND</span>
            <span class="st" value="29" display-name="Nebraska">NE</span>
            <span class="st" value="30" display-name="New Hampshire">NH</span>
            <span class="st" value="31" display-name="New Jersey">NJ</span>
            <span class="st" value="32" display-name="New Mexico">NM</span>
            <span class="st" value="33" display-name="Nevada">NV</span>
            <span class="st" value="34" display-name="New York">NY</span>
            <span class="st" value="35" display-name="Ohio">OH</span>
            <span class="st" value="36" display-name="Oklahoma">OK</span>
            <span class="st" value="37" display-name="Oregon">OR</span>
            <span class="st" value="38" display-name="Pennsylvania">PA</span>
            <span class="st" value="39" display-name="Rhode Island">RI</span>
            <span class="st" value="40" display-name="South Carolina">SC</span>
            <span class="st" value="41" display-name="South Dakota">SD</span>
            <span class="st" value="42" display-name="Tennessee">TN</span>
            <span class="st" value="43" display-name="Texas">TX</span>
            <span class="st" value="44" display-name="Utah">UT</span>
            <span class="st" value="45" display-name="Virginia">VA</span>
            <span class="st" value="46" display-name="Vermont">VT</span>
            <span class="st" value="47" display-name="Washington">WA</span>
            <span class="st" value="48" display-name="Wisconsin">WI</span>
            <span class="st" value="49" display-name="West Virginia">WV</span>
            <span class="st" value="50" display-name="Wyoming">WY</span>
          </div>
          <div id="program-options" class="selector-options">
            <input type="hidden" id="program-val" name="program-val" value="8" />
            <span class="prog" value="9" display-name="Basketball">Basketball</span>
            <span class="prog" value="31" display-name="Football">Football</span>
            <span class="prog" value="62" display-name="Soccer">Soccer</span>
            <span class="prog" value="13" display-name="Cheerleading">Cheerleading</span>
            <span class="prog" value="8" display-name="Baseball">Baseball</span>
            <span class="prog" value="75" display-name="Volleyball">Volleyball</span>
            <span class="prog" value="63" display-name="Softball">Softball</span>
            <span class="prog" value="7" display-name="Band">Band</span>
            <span class="prog" value="71" display-name="Track">Track and Field</span>
            <span class="prog" value="48" display-name="Other" style="display:none">Other</span>
            <span class="prog" value="78" display-name="Wrestling">Wrestling</span>
            <span class="prog" value="20" display-name="Dance">Dance</span>
            <span class="prog" value="41" display-name="Lacrosse">Lacrosse</span>
            <span class="prog" value="70" display-name="Tennis">Tennis</span>
            <span class="prog" value="73" display-name="Undefined" style="display:none">Undefined</span>
            <span class="prog" value="17" display-name="Cross Country">Cross Country</span>
            <span class="prog" value="15" display-name="Choir">Choir</span>
            <span class="prog" value="33" display-name="Golf">Golf</span>
            <span class="prog" value="68" display-name="Swim">Swim and Dive</span>
            <span class="prog" value="23" display-name="Drama">Drama</span>
            <span class="prog" value="55" display-name="ROTC">ROTC</span>
            <span class="prog" value="47" display-name="Orchestra">Orchestra and Symphony</span>
            <span class="prog" value="36" display-name="Hockey">Hockey</span>
            <span class="prog" value="76" display-name="Water Polo">Water Polo</span>
            <span class="prog" value="44" display-name="Music">Music</span>
            <span class="prog" value="54" display-name="Robotics">Robotics</span>
            <span class="prog" value="29" display-name="Field Hockey">Field Hockey</span>
            <span class="prog" value="22" display-name="DECA">DECA</span>
            <span class="prog" value="35" display-name="Gymnastics">Gymnastics</span>
            <span class="prog" value="5" display-name="AVID">AVID</span>
            <span class="prog" value="1" display-name="Action Sports">Action Sports</span>
            <span class="prog" value="46" display-name="Non-Profit">Non-Profit</span>
            <span class="prog" value="59" display-name="Senior">Senior Class</span>
            <span class="prog" value="21" display-name="Debate">Debate</span>
            <span class="prog" value="26" display-name="FBLA">FBLA</span>
            <span class="prog" value="66" display-name="Student Gov.">Student Government</span>
            <span class="prog" value="10" display-name="Bowling">Bowling</span>
            <span class="prog" value="4" display-name="ASB">ASB</span>
            <span class="prog" value="37" display-name="HOSA">HOSA</span>
            <span class="prog" value="56" display-name="Rugby">Rugby</span>
            <span class="prog" value="3" display-name="Art">Art</span>
            <span class="prog" value="6" display-name="Badminton">Badminton</span>
            <span class="prog" value="18" display-name="Culture">Culture and Language</span>
            <span class="prog" value="45" display-name="Honors Society">National Honors Society</span>
            <span class="prog" value="30" display-name="Film">Film and TV Production</span>
            <span class="prog" value="52" display-name="Powerlifting">Powerlifting</span>
            <span class="prog" value="12" display-name="Business">Business</span>
            <span class="prog" value="38" display-name="Journalism">Journalism</span>
            <span class="prog" value="80" display-name="Yearbook">Yearbook</span>
            <span class="prog" value="49" display-name="Outdoors">Outdoors</span>
            <span class="prog" value="39" display-name="Junior">Junior Class</span>
            <span class="prog" value="65" display-name="STEM">STEM</span>
            <span class="prog" value="27" display-name="FCCLA">FCCLA</span>
            <span class="prog" value="2" display-name="Archery">Archery</span>
            <span class="prog" value="74" display-name="Video Games">Video Games</span>
            <span class="prog" value="61" display-name="Skiing">Skiing</span>
            <span class="prog" value="16" display-name="Crew">Crew</span>
            <span class="prog" value="43" display-name="Model UN">Model UN and Trial</span>
            <span class="prog" value="53" display-name="Prom">Prom and Homecoming</span>
            <span class="prog" value="64" display-name="Sophomore">Sophomore Class</span>
            <span class="prog" value="72" display-name="Frisbee">Ultimate Frisbee</span>
            <span class="prog" value="77" display-name="Winter Sports">Winter Sports</span>
            <span class="prog" value="58" display-name="Scholarship">Scholarship</span>
            <span class="prog" value="40" display-name="Key and Link">Key and Link</span>
            <span class="prog" value="32" display-name="Freshman">Freshman Class</span>
            <span class="prog" value="42" display-name="Martial Arts">Martial Arts</span>
            <span class="prog" value="60" display-name="Shooting">Shooting</span>
            <span class="prog" value="24" display-name="Equestrian">Equestrian</span>
            <span class="prog" value="14" display-name="Chess">Chess</span>
            <span class="prog" value="67" display-name="Surf">Surf</span>
            <span class="prog" value="28" display-name="Fencing">Fencing</span>
            <span class="prog" value="57" display-name="Sailing">Sailing</span>
            <span class="prog" value="50" display-name="Photography">Photography</span>
            <span class="prog" value="19" display-name="Cycling">Cycling</span>
            <span class="prog" value="11" display-name="Boxing">Boxing</span>
            <span class="prog" value="25" display-name="Fashion">Fashion</span>
            <span class="prog" value="79" display-name="Writing">Writing</span>
            <span class="prog" value="34" display-name="GSA">GSA and LGBTQI</span>
            <span class="prog" value="69" display-name="Table Tennis">Table Tennis</span>
            <span class="prog" value="51" display-name="Polo">Polo</span>
          </div>
        </div>
      `;

    this.shadowRoot.append(style, container);
    this.location = this.shadowRoot.querySelector('p.location');
    this.views = {
      calculator: this.shadowRoot.querySelector('.calculator'),
      options: {
        states: this.shadowRoot.querySelector('#state-options'),
        programs: this.shadowRoot.querySelector('#program-options')
      }
    }
    this.inputs = {
      state: this.shadowRoot.querySelector('#state-val'),
      program: this.shadowRoot.querySelector('#program-val'),
      participant: this.shadowRoot.querySelector('#participant-val')
    }
    this.controls = {
      state: this.shadowRoot.querySelector('p.location'),
      program: this.shadowRoot.querySelector('span.program'),
      participant: this.shadowRoot.querySelector('span.participant-count'),
      estimate: this.shadowRoot.querySelector('.big-number')
    }
    this.selectedValues(this.inputs)
    this.stateOptions = this.shadowRoot.querySelectorAll('#state-options .st');
    this.animationFrame = { id: null };
    this.stateOptions.forEach(opt => {
      opt.addEventListener('click', this.selectOption('state', this.views, this.inputs, this.controls, this.animationFrame))
    })
    this.programOptions = this.shadowRoot.querySelectorAll('#program-options .prog');
    this.programOptions.forEach(opt => {
      opt.addEventListener('click', this.selectOption('program', this.views, this.inputs, this.controls, this.animationFrame))
    })
    this.controls.state.addEventListener('click', this.changeView(this.views, 'states'));
    this.controls.program.addEventListener('click', this.changeView(this.views, 'programs'));
    this.inputs.participant.addEventListener('input', this.selectParticipants(this.inputs, this.controls, this.animationFrame));
  }

  selectParticipants(inputs, controls, animationFrame) {
    return (event) => {
      controls.participant.innerHTML = inputs.participant.value;
      let start = parseInt(controls.estimate.innerHTML.replace(/,/g, ''));
      let end = parseInt(this.rpk(
        parseInt(inputs.state.value),
        parseInt(inputs.program.value),
        parseInt(inputs.participant.value),
      ).replace(/,/g, ''));
      let currentNumber = start;
      const steps = 20;
      const stepTime = 500 / steps;
      const increment = (end - start) / steps;
      if (animationFrame.id) cancelAnimationFrame(animationFrame.id);
      function step() {
        if ((increment > 0 && currentNumber < end) || (increment < 0 && currentNumber > end)) {
          currentNumber += increment;
          if ((increment > 0 && currentNumber > end) || (increment < 0 && currentNumber < end)) {
            currentNumber = end;
          }
          controls.estimate.innerHTML = Math.round(currentNumber).toLocaleString();
          setTimeout(() => { animationFrame.id = requestAnimationFrame(step); }, stepTime);
        }
      }
      step();
    }
  }

  selectedValues(inputs) {
    console.log(inputs.state.value)
    console.log(inputs.program.value)
    console.log(inputs.participant.value)
  }

  selectOption(optionType, views, inputs, controls, animationFrame) {
    return (event) => {
      views.calculator.style.marginLeft = "0px";
      const value = event.target.getAttribute("value");
      const displayName = event.target.getAttribute("display-name");
      inputs[optionType].value = value;
      controls[optionType].innerHTML = displayName;
      let start = parseInt(controls.estimate.innerHTML.replace(/,/g, ''));
      let end = parseInt(this.rpk(
        parseInt(inputs.state.value),
        parseInt(inputs.program.value),
        parseInt(inputs.participant.value),
      ).replace(/,/g, ''));
      let currentNumber = start;
      const steps = 20;
      const stepTime = 500 / steps;
      const increment = (end - start) / steps;
      if (animationFrame.id) cancelAnimationFrame(animationFrame.id);
      function step() {
        if ((increment > 0 && currentNumber < end) || (increment < 0 && currentNumber > end)) {
          currentNumber += increment;
          if ((increment > 0 && currentNumber > end) || (increment < 0 && currentNumber < end)) {
            currentNumber = end;
          }
          controls.estimate.innerHTML = Math.round(currentNumber).toLocaleString();
          setTimeout(() => { animationFrame.id = requestAnimationFrame(step); }, stepTime);
        }
      }
      step();
      controls.estimate.innerHTML = this.rpk(
        parseInt(inputs.state.value),
        parseInt(inputs.program.value),
        parseInt(inputs.participant.value),
      )
    }
  }

  changeView(views, selectedOptions) {
    return (event) => {
      const hiddenOptions = selectedOptions === 'states' ? 'programs' : 'states';
      views.calculator.style.marginLeft = "-460px";
      views.options[selectedOptions].style.display = "flex";
      views.options[hiddenOptions].style.display = "none";
    }
  }

  rpk(s, p, n) {
    const t = (this.d()[s][p] / (s + p + 2));
    return Math.round((t <= 0 ? this.a(s) : t) * n).toLocaleString()
  }

  a(s) {
    const v = this.d()[s].map((x, i) => x <= 0 ? null : (x / (s + i + 2))).filter(x => x)
    return v.reduce((a, b) => a + b, 30) / v.length;
  }

  d() {
    return [[-1, -1, -1, -1, -1, -1, -1, 279.36, 1610.5, 2256.7599999999998, -1, -1, -1, 3488.85, -1, 183.94, -1, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7168.589999999999, -1, -1, -1, 0, 4509.08, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4798.5, -1, -1, -1, -1, -1, -1, 0, 0, -1, -1, 0, -1, -1, 21237.12, 12145.25, -1, -1, -1, -1, 4469.5, -1, -1, 5764.8099999999995, -1, -1, -1, 7527.52, -1, -1, 9353.6, -1, -1, -1, -1], [-1, 325.36, 318.6, 66.36, -1, -1, -1, 669.4, 1154.34, 1305.48, 628.03, -1, 691.8, 2080.16, -1, 1187.28, -1, 1561.8000000000002, 128.52, 0, 3300.5, 2726.3999999999996, 0, 1406.86, -1, -1, 2991.06, 1652.7, -1, -1, -1, 2610.52, -1, 5885.64, -1, 4528.46, -1, 1371.6, 0, 0, -1, 5155.04, -1, 0, 1488.02, 1317.6, 0, -1, 4399.26, 4521.400000000001, -1, -1, -1, 1220.24, 5114.04, 2640.1600000000003, -1, -1, 134.20000000000002, 6005.9400000000005, -1, -1, 6199.7, 7199.9400000000005, 0, -1, 1943.04, -1, 5515.280000000001, -1, 8142.42, 4302.36, -1, 68433.44, 0, 8165.82, -1, -1, 5443.2, -1, 0, -1, -1], [-1, -1, -1, -1, -1, -1, -1, 1669.91, 1921.08, 1602.38, -1, -1, -1, 1556.35, -1, 496.09, -1, 0, -1, -1, 5370.4800000000005, -1, -1, -1, -1, -1, 0, 1766.69, -1, -1, -1, 1895.6, -1, 4472.93, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8772.4, -1, -1, -1, -1, -1, 0, 5128.28, -1, -1, -1, -1, -1, -1, 7114.8, 5517.45, -1, -1, 0, -1, 1316.8799999999999, -1, 4936.54, 275.25, -1, 0, -1, 8453.79, -1, -1, 10680.5, -1, 0, -1, -1], [0, 0, -1, 53.76, 0, 43.6, 651.2, 806.04, 1644.37, 1712.76, -1, -1, 151.13, 2038.68, -1, 1085.8, 583.59, 1741.3000000000002, 0, -1, 2260.25, 814.06, 1216.89, 1192.24, -1, -1, 0, 11.2, -1, -1, 0, 3606.12, -1, 6312.56, -1, 0, 8653.050000000001, 2101.26, 2723.6200000000003, -1, -1, 5496.54, -1, -1, 1891.4, 35.5, 0, 2227.16, 6263.54, 2503.98, -1, -1, -1, 0, 8576.240000000002, 4492.799999999999, 0, 0, -1, -1, -1, -1, 7957.59, 8257.24, -1, 3833.2, 10888.560000000001, -1, 5650.929999999999, -1, 7823.999999999999, 5163.44, -1, 21832.199999999997, -1, 11176.800000000001, -1, -1, 7921.5199999999995, -1, 3796.9500000000003, -1, -1], [-1, 957.53, 605.44, 1216.98, 2768.6000000000004, 526.6800000000001, 646.08, 1041.3, 2019.2199999999998, 1830.9, -1, -1, 1829.34, 2244.66, 2236, 1437.6599999999999, 2031.48, 1866.45, 1599.12, 2352.25, 3543.0200000000004, 2180.25, 2491.16, 2891.5899999999997, 1588.5, 21707.13, 0, 0, -1, 3334.8, 4457.16, 4638.32, 691.98, 5557.5, -1, 4607.58, 6300.84, 2039.49, 3924.3599999999997, 2389.5, 6047.160000000001, 12334.68, 12569.76, 4495.75, 3740, 1516.74, 27955.72, 3510.19, 25254.72, 3984.2, 1908.48, 0, -1, 18149.58, 5603.4, 4402.9800000000005, 8857.94, 1517.04, 18814.08, 4937.4, 3245.88, 6604.19, 6657.88, 8454.57, 6335, 6483.719999999999, 4444.5599999999995, 10333.150000000001, 5820.84, 0, 7041.400000000001, 4777.849999999999, 0, 17094.02, 5958.400000000001, 8835.48, 8217.22, 321.21000000000004, 8148.84, 0, 7111.34, -1, -1], [-1, 0, -1, 336, -1, 212.04000000000002, -1, 1045.52, 1703.4, 1635.36, -1, 2373.84, 1137.34, 2209.7999999999997, -1, 1354.54, 649.98, 1704.96, 2724.5, -1, 3530.25, 2273.6, 1792.78, 3643.2, 149.73, -1, 2539.02, 2106.64, -1, 1809.72, 1023.42, 3400.62, 0, 5411.599999999999, 359.57, 4338.18, 5533.67, 4279.4400000000005, 1891.3500000000001, -1, 0, 4464, -1, 0, 3978, 1654.12, 6472.889999999999, 4703.4, 7244.05, 966, 1357.74, -1, 6420.97, 351.6, 8428.98, 4608.46, 2464.56, -1, -1, 0, 1720.56, -1, 6061.65, 7533.400000000001, -1, 2781.36, 4512.86, -1, 5581.5, -1, 5685.68, 4620.72, 8503.56, 71159.2, 0, 8013.04, -1, 3535.5600000000004, 7004.000000000001, -1, 3103.29, -1, -1], [-1, 1377.72, -1, -1, -1, 0, -1, 1010.1, 2058.08, 1802.17, 0, -1, 616.5999999999999, 2159.01, -1, 1389.4299999999998, -1, 1777.25, 0, -1, 3209.08, 2195.0099999999998, 825, 1738.48, 0, -1, 1290.98, -1, -1, 3195.32, 0, 3478.0200000000004, 1420.3999999999999, 6402.150000000001, -1, 2723.6200000000003, 5724.4, 771.7499999999999, 2855.68, 45929.81, -1, 3662.2599999999998, -1, 75.99, 7666.360000000001, -1, 0, 965.8, 33183.36, 0, -1, -1, 0, -1, 5410.74, 1500.66, 203.52, 0, -1, 35135.47, 0, 1226.8200000000002, 6600.3, 7792.96, 0, 1300.8600000000001, -1, -1, 7586.32, -1, 6153.42, 4441.38, 4225.6, 12429.449999999999, -1, 7307.320000000001, -1, -1, 7600.679999999999, 0, 2305.6, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, 0, 1211.7599999999998, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2912.4, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, 5957.599999999999, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1717.49, -1, -1, -1, -1, -1, -1, -1, -1, 3241.6000000000004, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, 71.37, -1, -1, -1, 419.56, 1680.66, 1599.61, -1, -1, 799.04, 1878.41, -1, 430, -1, 1513.35, -1, -1, 3366.9, 0, 898.56, 599.61, -1, -1, -1, -1, -1, 2844.66, -1, 4809.71, -1, 2940.77, -1, -1, 3843.2999999999997, -1, -1, -1, -1, 3945.8700000000003, -1, -1, 4563.54, 0, -1, 0, 4401.62, -1, -1, -1, -1, -1, -1, 8347.95, -1, -1, -1, -1, -1, -1, 7187.76, 8102.2699999999995, -1, -1, -1, -1, 7368.66, -1, 2620, 4394.25, -1, -1, -1, 8850.2, -1, -1, 5912.719999999999, -1, -1, -1, -1], [-1, 1714.1999999999998, 877.89, 1262.38, -1, 299.04, 0, 1323.36, 3509.11, 2398, 1562.19, -1, 4111.02, 2969.7599999999998, 0, 1452.62, 8487.720000000001, 4109.84, 1670.69, -1, 5341.61, 2328.96, 773.5200000000001, 3171.86, -1, 0, 3886.85, -1, -1, 0, 3031.9500000000003, 4479.72, 614.9, 8206.880000000001, 0, 0, 6904.3, 2588.64, 2662.6600000000003, 1270, 835.89, 5811.52, 12207.49, 8220.960000000001, 3774.1000000000004, 2028.8799999999999, 5574.030000000001, 3676.62, 6601.51, 2638.2, -1, -1, 4155.48, 1443.2, 7391.8, 4266.24, 1002.99, -1, 533.37, 729.4, -1, -1, 8572.390000000001, 9195.98, 2398.5, 6040.4800000000005, 4814.04, -1, 7444.96, -1, 6926.31, 5680.96, -1, 8583.96, 0, 10320, 7299.3, 4892.8, 10832.189999999999, -1, 4064.0599999999995, -1, -1], [-1, -1, -1, 661.95, -1, -1, -1, 1353.75, 2800.4, 3175.2, -1, -1, 971.52, 3759.25, -1, 1704.51, -1, 2602.46, 9425.7, -1, 6135.68, -1, 1110.78, 2775.85, -1, -1, 1030.18, 1841.9699999999998, -1, -1, -1, 5359.09, -1, 9037.35, -1, 6547.57, -1, 2484.3, -1, -1, -1, 5209.37, -1, -1, 2999.92, 0, 6917.66, 2469.15, 5140.8, 11482.029999999999, 0, -1, -1, -1, 7345.14, 5335.88, 0, -1, 0, -1, -1, -1, 8071.179999999999, 13488, -1, -1, 0, -1, 11208, -1, 11339.779999999999, 7596.99, -1, -1, 1543.7, 10008.480000000001, 0, -1, 7234.2, -1, -1, -1, -1], [-1, -1, -1, 0, -1, -1, -1, 1689.6000000000001, 6431.25, 2004.1999999999998, 971.29, -1, -1, 4223.7, -1, 3144.96, 1405.6299999999999, 1880.4, -1, -1, 117.14999999999999, 2340.8999999999996, 0, 1162.44, -1, -1, -1, -1, -1, -1, 4929.95, 4512.64, -1, 4270.64, -1, 0, -1, 0, -1, -1, 0, 0, 2840.2, -1, 6505.9800000000005, 0, 0, 5034.599999999999, 2562, -1, 0, -1, -1, -1, 5373.400000000001, 2425.56, -1, -1, -1, 0, 0, -1, 11333.250000000002, 7823.44, -1, -1, -1, -1, 11233.89, -1, 0, 4358.76, -1, 8752.22, -1, 12400.96, 7407.47, -1, 4584.58, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, 854.07, 1872.64, 1687.7399999999998, 405.36, -1, 1608.62, 2220.48, -1, 1793.65, -1, 1825.8999999999999, -1, -1, 3869.54, 2582.65, 0, 1921.78, -1, -1, 2174.4, -1, -1, -1, -1, 1366.2, -1, 5110.78, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, 1194.22, -1, -1, 170.19, 3499.2799999999997, 7037.1, -1, -1, -1, 0, 9418, 1084.68, 6222.3, -1, -1, -1, -1, -1, 5829.2, 11197.339999999998, -1, -1, -1, -1, 3310.3399999999997, -1, 7746.48, 3759.5499999999997, -1, 0, -1, 9014.810000000001, -1, -1, 11492.64, -1, -1, -1, -1], [-1, -1, -1, -1, -1, 875, -1, 778.36, 2250.09, 2426.64, 0, 0, 1841.1299999999999, 3444.84, -1, 1457.1, -1, 2724.8, 2549.25, 0, 3586.45, 2617.56, 1901.8, 1093.64, -1, -1, -1, 1543.0800000000002, -1, -1, -1, 2447.66, -1, 6625.92, 0, -1, 3093.66, 1166.36, 0, -1, 0, 5475.12, -1, 0, 3783.6699999999996, 2515.8, 54992.72, 926.9, 55569.149999999994, -1, -1, -1, -1, -1, 10772.97, 7929.6, 7227.09, -1, -1, 4066.3, 7332.75, 2830.2400000000002, 7124.04, 7923.24, -1, 0, 0, -1, 7612.76, -1, 5566.65, 5077.44, -1, 6118.64, 2241.9100000000003, 9105.3, -1, -1, 7579.5, -1, -1, -1, -1], [-1, 936.5300000000001, 0, 1387.19, -1, 0, 1649.78, 1862.5400000000002, 3139.2000000000003, 3082.5, 2139.7999999999997, -1, 1337.5600000000002, 3214.94, -1, 2616.71, -1, 3350.16, 3524.78, -1, 4780.08, 7487.6900000000005, 1508.6000000000001, 4196.79, -1, 0, 0, -1, -1, 0, -1, 4582.5, 0, 6906.0599999999995, -1, 4733.82, 7210.32, 2703, 0, 2192.3, -1, 5818.5599999999995, -1, 5752.5, 2249.4, 1349.3200000000002, 7747.5199999999995, 8481.06, 77460.48, 0, -1, -1, -1, -1, 19429.2, 5104.900000000001, 0, -1, -1, 9654, -1, 0, 7373.34, 8506.720000000001, 0, 2262.33, 2755.2000000000003, -1, 8699.88, -1, 5174.62, 7615.11, 0, 6475.64, -1, 7921.55, 7879.8, -1, 7018.04, 0, 3236.16, -1, -1], [-1, -1, 242.82, 1546.3999999999999, -1, 288.41999999999996, -1, 2464.32, 3567, 2768.74, 678.51, -1, 1538.74, 2879.4, 2019.9599999999998, 1975.68, -1, 2455.14, 0, 0, 5158.91, 1307.96, 808.0799999999999, 2670.4, -1, -1, -1, 586.96, -1, -1, 2246.6, 9493.92, 0, 6659.999999999999, -1, 4937.400000000001, 0, 2607.66, 2085.6, 0, 0, 5147.5, 0, 0, 4291.349999999999, 1284.6399999999999, 2101.05, 2168.32, 5931.900000000001, -1, -1, -1, -1, 5852, 4994.849999999999, 2911.68, 12267.650000000001, -1, -1, 101.84, -1, -1, 6633.63, 8220.800000000001, -1, 0, 2252.62, -1, 7631.3, -1, 9228.96, 4201.12, -1, 7118.999999999999, -1, 9664.6, -1, -1, 8495.85, -1, 2503.5699999999997, -1, -1], [-1, -1, -1, -1, -1, 0, -1, 790.5, 1853.28, 2049.84, 0, -1, -1, 3184.94, -1, 1139.49, -1, 3040.7999999999997, -1, -1, 4387.86, -1, 1271.6, 2619.9, -1, -1, -1, -1, -1, -1, -1, 2693.04, -1, 4458.93, -1, 0, -1, -1, 0, -1, -1, 3071.54, -1, -1, -1, -1, 0, 0, 4470.18, -1, -1, -1, -1, -1, 7216.56, 1022, 6372.14, -1, -1, -1, -1, -1, 6717.6, 6729.48, -1, -1, -1, -1, 3697.1400000000003, -1, 0, 2200.9700000000003, -1, 0, -1, 8701.08, -1, -1, 6814.08, -1, -1, -1, -1], [-1, -1, 1710.87, 1009.36, -1, -1, -1, 1594.8400000000001, 3258.63, 2775.36, 808.23, -1, 948.6, 2986.56, -1, 1638.46, -1, 3126.2400000000002, -1, -1, 4808.31, -1, 232.47, 3932.46, 559, -1, 500.4, 810.9799999999999, -1, 6023.04, 0, 3988.0000000000005, -1, 8512.92, -1, 0, -1, 850.0799999999999, -1, -1, -1, 3919.7999999999997, -1, -1, 746.55, 0, -1, 3251.82, 7231.98, 1876.8000000000002, -1, -1, -1, 0, 4561.04, 2404.26, 912, -1, -1, 18321.42, -1, -1, 8489.61, 8294.300000000001, -1, -1, 0, -1, 7396.74, -1, 7397.68, 5951.7, -1, 6539.36, 0, 12889.28, -1, -1, 7729.929999999999, -1, 0, -1, -1], [-1, 0, -1, -1, -1, -1, -1, 1886.4900000000002, 2328.2000000000003, 2941.18, 419.1, -1, 0, 2404.0499999999997, 0, 1269.45, -1, 2960, -1, -1, 4908, 2061.07, -1, 0, -1, -1, -1, -1, -1, -1, -1, 7284.330000000001, -1, 1909.0600000000002, -1, 0, 0, -1, -1, -1, -1, 0, 0, -1, 0, -1, -1, 2619.03, 5214.240000000001, -1, -1, -1, 6454.8, -1, -1, 2510.25, -1, -1, -1, -1, 0, -1, 5783.46, 11698.849999999999, -1, 1602.2500000000002, -1, -1, -1, -1, 11559.6, 4657.38, -1, 0, -1, 9594.05, -1, 5000.349999999999, 10178.28, -1, -1, -1, -1], [-1, 1136.52, -1, 0, -1, 0, -1, 2130.24, 3886.5800000000004, 3922.7999999999997, 0, -1, 0, 4063.68, -1, 2496.2400000000002, 2109, 3431.78, 3420.3, -1, 3503.04, 0, 2970.0099999999998, 2999.04, -1, -1, 0, -1, -1, 3967, 30756.059999999998, 5745.48, 0, 6975.72, -1, 3617.5999999999995, 10727.970000000001, -1, -1, 0, -1, 5916.04, -1, -1, 12806.300000000001, 0, 20470.51, 0, 17975.19, 0, 0, -1, -1, -1, 10562.250000000002, 2774.7599999999998, 7452.06, 5005.26, -1, 3376, -1, 9191.380000000001, 8392.13, 12720.12, -1, -1, 3198.9900000000002, -1, 10467.289999999999, -1, 7314.58, 6422.52, 10181.640000000001, 6509.5, 0, 11570.880000000001, 0, -1, 49995, -1, -1, -1, -1], [-1, 0, -1, 4767, -1, 656.91, 430.92, 1851.65, 5633.1, 4615.900000000001, -1, -1, -1, 3090.85, 104.04, 2553, 0, 1729.65, -1, -1, 7209.72, 0, -1, 2188.8, 0, -1, 4477.92, -1, -1, 4596.12, 3621.28, 4797.5599999999995, -1, 6889.849999999999, -1, 3910.2, 8345.039999999999, -1, 0, 4922.09, 2145.82, 6206.759999999999, 0, -1, 1250.0400000000002, 1562.44, 7556.84, 1749.15, 4813.9, -1, -1, -1, -1, -1, 7055.08, 2631.09, 3967.08, -1, 1379.1999999999998, 4383.719999999999, 3561.2599999999998, -1, 7775.04, 8786.45, 2325.44, -1, 4600.64, -1, 6536.7, -1, 5860.400000000001, 6596.490000000001, 692.78, 5954.6, -1, 9124.789999999999, -1, -1, 7845, 0, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, 1037.7, 1609.52, 3447.04, -1, -1, -1, 4732.56, -1, 1427.2800000000002, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4830.28, -1, 4838.4, -1, -1, -1, -1, 6553.129999999999, -1, -1, 0, -1, 7784.96, -1, -1, 0, -1, -1, -1, 27374.05, -1, -1, -1, -1, -1, 0, 0, -1, 0, -1, -1, -1, -1, 6304.45, 8016.0599999999995, -1, -1, 22727.04, -1, -1, -1, 0, 4222.4800000000005, -1, -1, -1, 6.86, -1, 0, 11105.96, -1, -1, -1, -1], [-1, -1, -1, 0, -1, -1, -1, 1468.16, 3743.36, 3112.89, 3484.66, -1, 676.08, 3512.7799999999997, -1, 2257.71, 5851.2, 2564.5499999999997, -1, -1, 5752.56, -1, 3243.9199999999996, 4808.099999999999, 998.8799999999999, -1, 0, 0, -1, 4203.96, -1, 3982.0000000000005, -1, 9622.17, -1, 4771.33, 8820.599999999999, 0, 3882.44, -1, 0, 7325.5, -1, 2596.92, 4616.52, 0, 9308.599999999999, 2193.19, 6776.64, -1, -1, -1, 0, 3738.35, 5771.219999999999, 2918.2599999999998, 5073.6, -1, -1, 7026.78, 0, 6622.349999999999, 7368.4800000000005, 8392.89, -1, 6668.77, 7419.599999999999, -1, 33649.92, 0, 7919.5, 3989.05, -1, 15005.9, 1486.66, 10648.44, 5294, 1437.23, 9479.88, -1, 3131.44, -1, -1], [-1, 1406.3400000000001, 0, -1, -1, -1, 2205.65, 3478.4, 4220.04, 3380.6200000000003, -1, 0, -1, 2764.88, -1, 3886.3999999999996, -1, 2783.76, 0, -1, 4321.8, -1, 3224.2, 1843.1999999999998, -1, -1, -1, -1, -1, -1, -1, 5864.88, -1, 5371.38, -1, 3254.4, 7298.650000000001, 5791.42, -1, -1, -1, 5196.839999999999, -1, -1, 3162.96, -1, 8617.98, 2043.36, 8254.84, 6119.0599999999995, -1, -1, -1, -1, 5667.46, 3976.8, 1085.4, -1, -1, 7131.6, 0, 4656.04, 8416.38, 5712.08, -1, -1, 1049.23, -1, 9092.609999999999, -1, 9642.5, 5985.6, 3797.5499999999997, 221807.32, -1, 7787, -1, 0, 9758.22, -1, 2691.15, -1, -1], [-1, 0, 0, 140.07, -1, -1, -1, 2476.65, 2757.06, 2850.05, 2097, -1, -1, 3602.8199999999997, -1, 1439.51, 0, 2604.94, 0, -1, 5409.14, 1864.96, 3640.7999999999997, 2567.11, 0, -1, 3775.72, 1252.92, -1, 3140.5, 0, 4605.599999999999, -1, 8170.910000000001, -1, 0, 2129.7000000000003, 1995.84, 3281.92, -1, 0, 3817.66, -1, -1, 0, -1, 1673.28, 1937.4199999999998, 8027.52, 1159.5, -1, -1, 716.8199999999999, 7419.68, 5412.799999999999, 4926.42, 3939.2799999999997, -1, 404.03999999999996, 3064.2499999999995, -1, -1, 7495.84, 7973.51, -1, -1, 2206.16, -1, 8413.94, -1, 5708.16, 4534.75, -1, 8502.119999999999, -1, 8287.05, 5384.58, 5900.87, 9371.44, -1, 0, -1, -1], [-1, 445.2, 0, -1, -1, -1, -1, 1671.4399999999998, 3258.5, 2198.52, 3478.74, -1, -1, 2182, -1, 708.5400000000001, -1, 67.32000000000001, -1, -1, 3725.6899999999996, -1, -1, 0, -1, -1, -1, -1, -1, -1, 0, 2677.86, -1, 0, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 6647.38, 0, 7523.999999999999, -1, -1, -1, 2334.4500000000003, -1, -1, 0, -1, -1, 0, -1, -1, -1, 4021.91, 7102.8, -1, -1, -1, -1, -1, -1, -1, 5198.9, 0, 5122, -1, 7735.68, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, 1832.9499999999998, -1, 3738.48, -1, -1, -1, 4731.8099999999995, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7983.879999999999, -1, 903.4100000000001, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8366.84, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, 8436.48, -1, 10666.32, 7387.38, -1, 0, -1, 6166.61, -1, -1, 0, -1, -1, -1, -1], [-1, 260.1, -1, 1708.16, -1, 0, -1, 2157.84, 5541.490000000001, 4127.18, -1, -1, 0, 4593.96, -1, 2126.52, 5160.15, 4795.04, 0, -1, 7287.28, 2322.5, 2085.9, 4462.639999999999, -1, -1, 5311.9, 2200.7999999999997, -1, 7002.92, -1, 4545, 1778.1499999999999, 8960.86, -1, 2900.48, -1, 2617.56, 0, -1, 0, 6896.4, -1, -1, 3148.4900000000002, 3090.98, 1864.5, 7830.28, 29311.59, 5441.280000000001, -1, -1, -1, -1, -1, 6696.48, 1173.8500000000001, -1, -1, 3734.72, -1, -1, 7538.4400000000005, 10768.6, -1, 4538.32, 3615.7000000000003, -1, 10059.869999999999, -1, 10714.77, 6323, 0, 10284.66, 0, 10677.68, -1, 4072.52, 9692.06, -1, 4561.650000000001, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7003.799999999999, -1, -1, -1, -1], [-1, -1, -1, 0, -1, -1, -1, 922.26, 4229.16, 3948.8, -1, -1, 0, 0, -1, 2590.72, -1, 2703.36, 0, -1, 3702.09, 2232.36, 1632.9299999999998, 2325.78, -1, -1, 2404.83, -1, -1, -1, -1, 1594.6399999999999, -1, 9368.32, -1, -1, -1, 484.84, 3140.88, -1, -1, 0, -1, -1, -1, 2747.4, -1, 744.9000000000001, 9082.63, -1, -1, -1, -1, -1, 7452.8, 1032, 0, 0, -1, -1, -1, -1, 6927.57, 6385.420000000001, -1, -1, 0, -1, -1, 4159, 7655.799999999999, 6422.94, 0, -1, -1, 26156.559999999998, 0, -1, 5076.13, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, 0, 5032.4, 4680.150000000001, -1, -1, -1, 6451.200000000001, -1, 47, 0, 0, -1, -1, -1, -1, 1205.28, -1, 0, -1, -1, -1, -1, 9118.890000000001, -1, 7050.96, -1, 0, -1, -1, 8765.88, -1, -1, 0, -1, 9333.78, -1, -1, 0, -1, -1, -1, 121189.59999999999, -1, -1, -1, -1, -1, 0, 3409.5299999999997, -1, -1, -1, 0, -1, 7402.799999999999, 6887.379999999999, 10635.25, -1, -1, -1, -1, -1, -1, 3285.42, 2073.39, -1, -1, -1, 17952.46, -1, -1, 0, -1, -1, -1, -1], [-1, 2536.74, 133, 0, -1, -1, -1, 2802.7999999999997, 5528.030000000001, 4719.12, 2862.94, -1, 0, 5724.24, -1, 2128.32, 6174.490000000001, 4949.5, 992.46, 7245.160000000001, 11052.619999999999, -1, 3070.1, 4985.12, -1, -1, 1496.24, -1, 7785.429999999999, 4888.08, 1871.73, 7942.4, 911.9499999999999, 11581.679999999998, 0, 10705.92, 10482.48, -1, 100.82, 6656.400000000001, -1, 7309.72, -1, 3084.08, 5246.009999999999, 3800.9399999999996, 3297.46, 3297.6, 24935.850000000002, -1, 0, -1, -1, -1, 3647.04, 4506.4800000000005, -1, -1, 6164.339999999999, 13959.16, -1, 6988.9, 8734.3, 11063.039999999999, 10256.779999999999, -1, 4073.85, 18822, 10050.51, -1, 9067.09, 6417.84, -1, 12303.42, -1, 10904.76, -1, 0, 29663.64, -1, 3813.75, -1, -1], [-1, -1, -1, -1, -1, -1, -1, 4566.99, 5536.02, 5301.9, -1, -1, -1, 4842.41, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 17215.25, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8217.22, -1, -1, -1, -1, -1, 0, 0, 0, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, 0, 8639.4, -1, 0, -1, 21667.02, -1, -1, 7213.92, -1, -1, -1, -1], [-1, -1, -1, 0, -1, -1, -1, 3282.3, 3940.52, 5988.4, 233.1, -1, -1, 5432.64, -1, 2221.5, -1, 2388.88, -1, -1, 8418.3, 446.88, 1943.7, 0, -1, -1, -1, -1, -1, -1, 0, 12893.76, -1, 10744, -1, -1, -1, 1920.2400000000002, 1906.03, -1, -1, 7122.72, -1, -1, 0, 1024, 0, 3719.52, 14612.98, -1, -1, -1, -1, -1, 7064.82, 2521.8, -1, -1, -1, -1, -1, -1, 9778.57, 6811, -1, 0, 21388.77, -1, 10722.3, -1, 10557.75, 4670.360000000001, -1, 21642.12, -1, 11053.9, -1, -1, 14477.560000000001, -1, 1190.25, -1, -1], [-1, 5535.570000000001, -1, 1955.85, -1, -1, -1, 4030.3900000000003, 7885.68, 4868.1, 3026.34, -1, -1, 6165.179999999999, -1, 2453.61, 0, 4494.93, 3991.6800000000003, -1, 3461.36, -1, 3714.8999999999996, 2756.48, -1, -1, -1, -1, 0, 8126.3, -1, 9090.560000000001, -1, 9093.51, -1, 0, 8241.119999999999, -1, -1, -1, -1, 10405.01, -1, -1, 38340, 14483.61, -1, 1518.9, 203187.6, 790.5000000000001, -1, -1, -1, -1, 5166, 7456.54, 4285.36, -1, 0, 879.6999999999999, -1, -1, 21323.82, 12683.880000000001, 0, 0, -1, 0, 14779.440000000002, -1, 7429.54, 11810.66, 4992.839999999999, 18184.47, -1, 10653.78, -1, -1, 8987.76, -1, -1, -1, -1], [-1, -1, 1705.08, -1, -1, -1, -1, 2249.2799999999997, 6261.75, 4707.18, 4446.2, -1, 0, 4951.5, -1, 3796, -1, 4260.6, -1, -1, 10621.949999999999, -1, 2693.35, 3078, -1, -1, -1, 0, -1, 0, 0, 5888.799999999999, -1, 13668.900000000001, -1, 7670.16, 6745.929999999999, -1, -1, 0, -1, 6952.92, -1, -1, 10065.060000000001, 1345.6200000000001, 11641.58, 0, 6185.45, -1, -1, -1, -1, 12965.4, 3609.9700000000003, 5221, 8572.74, -1, -1, 6930.24, -1, -1, 10823.67, 13527.000000000002, 0, 0, 0, -1, 10293.15, -1, 10829.47, 5918.4, 0, -1, 0, 12806.08, -1, -1, 14948.85, -1, 6894.81, -1, -1], [-1, 3079.4399999999996, 0, 0, -1, 0, -1, 3161.7000000000003, 5664.900000000001, 5891.45, -1, -1, 0, 8309.94, -1, 2938.8500000000004, -1, 5456, 997.3599999999999, -1, 9086.859999999999, 7353.17, 1549.2, 5430.219999999999, 0, -1, 547.2, 0, -1, -1, -1, 5260.5599999999995, -1, 11971.310000000001, -1, 2066.63, 0, -1, -1, 0, 2085.72, 9280.92, 0, -1, 2973.3199999999997, -1, 12099.359999999999, 2198.9500000000003, 12216.300000000001, 1171.02, -1, -1, 0, -1, 3725.0800000000004, 3061.56, 3773.16, -1, 0, 165.87, -1, -1, 8113, 11058.49, -1, -1, 3257.28, -1, 11245.54, -1, 9302.039999999999, 4975.849999999999, -1, 5092.68, -1, 13618.76, -1, -1, 7173.4400000000005, -1, -1, -1, -1], [-1, 0, 0, -1, 2028.74, 771.32, -1, 3707.6, 6399.99, 5552.16, -1, -1, -1, 5549.96, -1, 3684.42, -1, 5713.68, 1343.49, -1, 4872.81, 4221.6, 3622.79, 4568.160000000001, 1093.68, -1, 2947.75, -1, -1, -1, -1, 7677.6, -1, 11279.52, -1, 3659.3, -1, -1, 10501.26, -1, -1, 9524.8, -1, -1, 5650.639999999999, 3643.08, 4333.3, 3587.06, 14649.929999999998, 0, -1, -1, -1, -1, 19955.01, 5202.900000000001, 7011, -1, -1, 5625.2, -1, 24998, 12004.86, 14639.04, -1, -1, 1274.7, -1, 13213.43, -1, 10139.18, 5880.6, -1, 13585.6, -1, 17267.579999999998, 7432.45, 2703.96, 8722.35, -1, -1, -1, -1], [-1, 0, -1, 4473.29, -1, 0, 312.34, 2837.39, 7547.52, 5419.4, 3024.5, 0, -1, 4671.42, -1, 2594.9, 547.12, 2768.4900000000002, 3466.6600000000003, -1, 2827.2, 3031.7000000000003, 3144.64, 7520.31, -1, -1, 6797.339999999999, -1, -1, 6977.969999999999, 2563.3999999999996, 7641.02, -1, 8581.880000000001, 0, 3330.7499999999995, 4660.32, 0, 1584.1799999999998, 159.58, -1, 8134.830000000001, -1, 934.5799999999999, 8042.16, 781.15, -1, 6355.349999999999, 25798.960000000003, -1, -1, -1, -1, -1, 4828.78, 3140.7000000000003, 0, -1, 0, 16688.43, -1, 0, 11364.84, 12855.43, -1, 11784.15, 897.82, -1, 7339.679999999999, -1, 9396.2, 5514.48, -1, 0, -1, 11267.7, -1, -1, 12616.56, -1, 1470, -1, -1], [-1, -1, -1, -1, -1, -1, -1, 1207.68, 7835.1, 8210, -1, -1, -1, 3695.2200000000003, -1, -1, -1, 363.08, -1, -1, 10948.279999999999, -1, 3463.74, 0, -1, -1, 1327.27, -1, -1, 3565.7999999999997, -1, 9041.76, 0, 4973.54, -1, 4347.96, 12889.800000000001, 11519.82, -1, 5404.8, -1, 11548.880000000001, -1, 5882.52, 0, 14586.460000000001, 0, -1, 6071.58, 0, -1, -1, -1, -1, 9998.75, 0, -1, -1, 0, 839, -1, -1, 10294.85, 7506.720000000001, 2473.7999999999997, 0, -1, -1, 7842.55, -1, 4168.049999999999, 1974.56, -1, 0, -1, 9607.119999999999, -1, -1, 7601.72, -1, -1, -1, -1], [-1, 0, 0, 1323, -1, 231.70999999999998, -1, 3886.19, 5117.5, 5041.86, -1, -1, 2926.2599999999998, 6805.150000000001, -1, 4019.07, -1, 4640.35, 977.4, -1, 10321.14, 5449.5, 1258.88, 4947.15, 0, -1, 2031.16, -1, -1, 3657.21, -1, 6023.2300000000005, -1, 12825.75, -1, 10533.6, 16947.84, 7160.56, 1636.8000000000002, -1, -1, 7401.110000000001, -1, -1, 10773.22, 1224.96, 1268.96, 8152.4, 21752.1, 7208.11, -1, -1, 0, 0, 9188.16, 6333.130000000001, 12296.06, -1, -1, 0, -1, -1, 11842.48, 10409.7, -1, 0, 8668.08, -1, 10914.2, -1, 13828.64, 11077.39, -1, 7786.65, -1, 14334.84, -1, 0, 7951.200000000001, -1, 0, -1, -1], [-1, -1, -1, -1, -1, -1, -1, 394.5, 6002.19, 2017.08, -1, -1, -1, 5549.599999999999, -1, 1129.26, -1, 5171.4, -1, -1, 2672.46, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, 2809.7799999999997, -1, -1, -1, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, -1, -1, -1, -1, 2588.75, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 21865.68, -1, -1, -1, -1, -1, -1, 5512.14, 0, -1, -1, -1, 5216.78, -1, -1, 6238.76, -1, -1, -1, -1], [-1, -1, 74.52000000000001, -1, -1, 647.2900000000001, -1, 3262.98, 5818.8, 5292.049999999999, 1599.48, -1, -1, 7998.24, -1, 3815.53, -1, 3942.43, 7651.42, -1, 8643.2, -1, 5428.5, 3699.74, -1, -1, 3472.7, 0, -1, 0, -1, 6594.750000000001, 0, 8150.45, -1, -1, 13041.6, 3167.91, 3044.6600000000003, -1, -1, 6011.2, -1, 2566.5, 3567.52, 1318.0900000000001, 5638.5, 3272.36, 8130.959999999999, 4867.62, -1, -1, -1, -1, 6542.4800000000005, 7591.320000000001, 5662, -1, -1, -1, 0, -1, 9063, 11596.66, -1, 12406.38, 4620, -1, 3363.36, -1, 8947.859999999999, 5556.8, -1, 7071.48, -1, 12236.77, -1, -1, 9190.26, -1, 8681.24, -1, -1], [-1, 5616.599999999999, 4140.2300000000005, 3434.88, 3814.6499999999996, 1584, -1, 3244.28, 6207.360000000001, 5769.9, 5809.1, 0, 4895.7300000000005, 7856.68, 4832.1, 4832.400000000001, -1, 4875.0599999999995, 7654.5, -1, 7712.25, 5408.7, 2741.6400000000003, 6022.759999999999, 8871.33, 1131.2, 2683.09, 3006, -1, -1, 6655.5, 5522.16, 602.14, 13221, -1, 7654.400000000001, 4938.57, 5292.280000000001, 5057.19, 11409.720000000001, 0, 11840.480000000001, -1, 1694, 5987.03, 3769.2000000000003, 185368.82, 5579.8, 13099.05, 10123.800000000001, -1, 4395.84, 5371.860000000001, 13487.74, 11128.59, 8181, 9383.91, -1, 6059.49, 14374.88, 6036.45, -1, 10359.74, 11617.56, 3931.63, 3606.9, 5679.87, -1, 12228.86, -1, 9280.5, 7847.400000000001, -1, 12974.1, 27.37, 14478, 10709.710000000001, 9803.92, 10939.619999999999, 0, 6443.75, -1, -1], [-1, -1, -1, 0, 1422, -1, -1, 3485.28, 7923.960000000001, 5429.6, 0, -1, -1, 7360.25, -1, 5140.469999999999, -1, 4881.240000000001, 0, 0, 8812.320000000002, 3342.63, 6256.68, 5560.71, 3189.2000000000003, -1, -1, 0, -1, -1, 0, 7223.37, -1, 9612.720000000001, -1, 3934.98, 0, 3552.3999999999996, 0, -1, 0, 11684.1, -1, -1, 3010.5000000000005, 3005.73, 7499.839999999999, 3180.6000000000004, 11272.48, -1, -1, -1, -1, -1, 8673, 984.75, 10127.58, -1, 8551.92, -1, -1, -1, 14659.920000000002, 13502.92, -1, -1, 17211.039999999997, 0, 6618.84, -1, 10473.640000000001, 5328.18, -1, 11326.42, -1, 11220.33, 0, -1, 9065.64, -1, 5024.88, -1, -1], [-1, -1, -1, 2710, -1, 2968.16, -1, 3791.88, 6540.6, 8660.4, 0, -1, 2518.71, 5889, -1, 4863.28, -1, 5496.96, 1139.45, -1, 8411.18, 0, 6048.54, 7991.2, -1, -1, 1245.3799999999999, 910.94, -1, 6940.32, -1, 9365.46, -1, 11300, 0, 4527.22, 6669.88, -1, 2975, 0, -1, 7999.200000000001, 0, 0, 4536.35, 5581.64, 7564.62, 3669.7599999999998, 8144.35, 907.1999999999999, 0, -1, -1, -1, 12898.71, 5928.24, 1230.85, -1, -1, 12232.400000000001, 449.40000000000003, -1, 14810.92, 11860.199999999999, -1, 0, 8870.5, -1, 9534.65, -1, 8627.58, 8846.46, 0, 271.2, -1, 12817.32, 591.63, -1, 8743.75, -1, 2211.07, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, 1673.8400000000001, 3596.7000000000003, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3625.31, -1, -1, -1, 0, -1, -1, -1, -1, -1, 4049.5, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, 0, 0, -1, -1, -1, -1, -1, -1, -1], [-1, 5838, 0, 1937, 0, 1582.74, 337.15, 4277.84, 6272.849999999999, 8332.28, 1742.27, -1, -1, 7646.46, 2790.8999999999996, 7687.04, -1, 4908.42, 39592.98, -1, 6782.01, 7023.099999999999, 4190.42, 8480.880000000001, 5695.46, 0, 3407.25, 0, -1, -1, -1, 7453.6, 0, 8689.539999999999, -1, 9148.44, 12468.65, 0, -1, 0, 0, 9785.7, 14731.989999999998, 0, 6519.299999999999, -1, 1523832.3, 7763.52, 37032.659999999996, -1, -1, -1, -1, 0, 12166.36, 5524.48, 4371.150000000001, 9013.18, -1, 4311.360000000001, -1, -1, 10997.88, 17859.52, 0, 94.61999999999999, 0, -1, 7072.650000000001, -1, 6548.57, 5701.2, 4973.1, 43102.6, 0, 16500.68, 13193.75, -1, 12390.12, -1, 0, -1, -1], [-1, -1, -1, 1283.13, -1, 3705.8999999999996, -1, 2448.15, 5800, 5154.83, -1, 0, -1, 5014.799999999999, -1, 8400.6, -1, 3109.47, 9904.2, -1, 8655.5, 0, 2571.12, 3932.5099999999998, -1, -1, 2467.72, 0, -1, 2674.15, -1, 6381.990000000001, -1, 8212.85, 0, 9775, 9159, 17092.02, -1, 2718.06, 0, 7832.369999999999, 0, 0, 3251.4600000000005, -1, 41848.32, 2495.81, 6995.24, 2896.7400000000002, -1, -1, 4631.82, 4443.42, 4556.24, 487.2, 5695.38, -1, 2250.72, -1, 0, -1, 9859.36, 10913.539999999999, 0, -1, 662.36, -1, 7509.52, -1, 9622.8, 6275.0599999999995, 2028.86, 7206.570000000001, 0, 10468.75, 8070.299999999999, 0, 10658.56, -1, 1006.2, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, 3022.8, -1, -1, -1, -1, -1, 3392.4, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, 4373.88, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, 13563.720000000001, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, 3028.47, -1, -1, -1, 0, -1, 2310.1, -1, 223.78, -1, -1, -1, -1, 0, -1, 3593.44, -1, -1, -1, -1, -1, -1, -1, -1, 3253.6000000000004, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, -1]]
  }
}

customElements.define('snap-forecast', SnapForecast);

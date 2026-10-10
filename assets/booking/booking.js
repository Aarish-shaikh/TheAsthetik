/**
 * The Asthetik - Luxury Cal.com / Calendly Style Multi-Step Booking Flow
 * Features:
 * - Single source of truth from CLINIC_CONFIG
 * - Interactive Monthly Calendar with Month navigation & Sunday closed detection
 * - Branch-specific 30-min time slot generation (Shah Faisal vs DHA)
 * - Pakistani phone number validation
 * - Instant WhatsApp confirmation + background backup API call
 */
document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('asthetik-booking-app');
  if (!container) return;

  var config = window.CLINIC_CONFIG;
  if (!config) {
    console.error('CLINIC_CONFIG not found.');
    return;
  }

  // Month names for Calendar
  var MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Current Date anchor
  var today = new Date();
  var todayYear = today.getFullYear();
  var todayMonth = today.getMonth();
  var todayDate = today.getDate();

  // Pick default date (tomorrow if today is Sunday)
  var defaultDateObj = new Date();
  if (defaultDateObj.getDay() === 0) {
    defaultDateObj.setDate(defaultDateObj.getDate() + 1);
  }

  function formatYMD(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  // Booking State
  var state = {
    currentStep: 1,
    branchId: 'shah-faisal-colony',
    serviceId: config.services[0].id,
    serviceName: config.services[0].name,
    viewYear: defaultDateObj.getFullYear(),
    viewMonth: defaultDateObj.getMonth(),
    date: formatYMD(defaultDateObj),
    timeSlot: '',
    name: '',
    phone: '',
    notes: '',
    backupSaved: false
  };

  // URL Parameters override (e.g. ?branch=dha&service=hydrafacial)
  try {
    var params = new URLSearchParams(window.location.search);
    var branchParam = params.get('branch');
    if (branchParam && config.branches[branchParam]) {
      state.branchId = branchParam;
    }
    var serviceParam = params.get('service');
    if (serviceParam) {
      var foundService = config.services.find(function(s) { return s.id === serviceParam; });
      if (foundService) {
        state.serviceId = foundService.id;
        state.serviceName = foundService.name;
      }
    }
  } catch (e) {}

  // Helper: Format Time 12h
  function formatTime12h(hour, minute) {
    var period = hour >= 12 ? 'PM' : 'AM';
    var h12 = hour % 12;
    if (h12 === 0) h12 = 12;
    var mStr = minute < 10 ? '0' + minute : minute;
    var hStr = h12 < 10 ? '0' + h12 : h12;
    return hStr + ':' + mStr + ' ' + period;
  }

  // Validate Pakistani Phone format
  function isValidPakistaniPhone(phoneStr) {
    if (!phoneStr) return false;
    var cleaned = phoneStr.replace(/[\s\-\(\)]/g, '');
    var mobileRegex = /^(?:\+92|92|0)?3[0-9]{9}$/;
    var landlineRegex = /^(?:\+92|92|0)?(?:21|42|51)[0-9]{7,8}$/;
    return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
  }

  // Render Base Skeleton UI
  container.innerHTML = `
    <div class="ast-booking-header">
      <div class="ast-booking-topline">
        <span class="ast-booking-brand">
          <span class="ast-booking-brand-dot"></span>
          The Asthetik Clinic
        </span>
        <span class="ast-booking-secure">
          🔒 Direct Clinic Booking
        </span>
      </div>

      <h3 class="ast-booking-title">Book a Consultation</h3>
      <p class="ast-booking-subtitle">Personalised aesthetic assessment with Dr. Samina Habib</p>
      
      <!-- Cal.com Step Progress Stepper -->
      <div class="ast-stepper-wrap" role="progressbar" aria-label="Booking Progress" aria-valuemin="1" aria-valuemax="5" aria-valuenow="1">
        <div class="ast-stepper-line-track"></div>
        <div class="ast-stepper-line-fill" id="ast-stepper-line" style="width: 0%;"></div>
        
        <div class="ast-stepper-items">
          <button type="button" class="ast-step-btn active" data-step="1" aria-label="Step 1: Branch">
            <span class="ast-step-num">1</span>
            <span class="ast-step-name">Branch</span>
          </button>
          <button type="button" class="ast-step-btn" data-step="2" aria-label="Step 2: Service">
            <span class="ast-step-num">2</span>
            <span class="ast-step-name">Service</span>
          </button>
          <button type="button" class="ast-step-btn" data-step="3" aria-label="Step 3: Date & Time">
            <span class="ast-step-num">3</span>
            <span class="ast-step-name">Date & Time</span>
          </button>
          <button type="button" class="ast-step-btn" data-step="4" aria-label="Step 4: Details">
            <span class="ast-step-num">4</span>
            <span class="ast-step-name">Details</span>
          </button>
          <button type="button" class="ast-step-btn" data-step="5" aria-label="Step 5: Confirm">
            <span class="ast-step-num">5</span>
            <span class="ast-step-name">Confirm</span>
          </button>
        </div>
        <div class="ast-stepper-mobile-info" id="ast-mobile-step-label">Step 1 of 5 • Branch</div>
      </div>
    </div>

    <div class="ast-step-container" aria-live="polite">
      <!-- STEP 1: BRANCH -->
      <div class="ast-step-pane active" id="ast-step-1">
        <div class="ast-pane-header">
          <h4 class="ast-pane-title">1. Select Clinic Branch</h4>
          <p class="ast-pane-desc">Choose which of our two Karachi clinics you would like to visit:</p>
        </div>
        <div class="ast-branch-select-grid" role="radiogroup" aria-label="Select Clinic Branch">
          <!-- Populated dynamically -->
        </div>
      </div>

      <!-- STEP 2: SERVICE -->
      <div class="ast-step-pane" id="ast-step-2">
        <div class="ast-pane-header">
          <h4 class="ast-pane-title">2. Select Treatment or Assessment</h4>
          <p class="ast-pane-desc">Choose your desired treatment. Unsure? Select "Initial Skin Consultation":</p>
        </div>
        <div class="ast-form-item">
          <label for="ast-service-select" class="ast-field-label">Selected Treatment / Procedure</label>
          <select id="ast-service-select" class="ast-custom-select" aria-label="Select Treatment">
            <!-- Populated dynamically -->
          </select>
          <div class="ast-service-highlight-box" id="ast-service-preview">
            <!-- Populated dynamically -->
          </div>
        </div>
      </div>

      <!-- STEP 3: DATE & TIME (Cal.com Style) -->
      <div class="ast-step-pane" id="ast-step-3">
        <div class="ast-pane-header">
          <h4 class="ast-pane-title">3. Choose Appointment Date & Time</h4>
          <p class="ast-pane-desc">Select a date from the calendar to view available 30-minute consultation slots:</p>
        </div>

        <div class="ast-cal-wrapper">
          <!-- Top Doctor Context Strip -->
          <div class="ast-cal-top-banner">
            <div class="ast-cal-doctor-badge">
              <div class="ast-cal-avatar">SH</div>
              <div class="ast-cal-doc-info-text">
                <span class="ast-cal-doc-name">Dr. Samina Habib</span>
                <span class="ast-cal-service-title" id="ast-cal-banner-service">Initial Skin Consultation</span>
              </div>
            </div>
            <div class="ast-cal-meta-pills">
              <span class="ast-cal-meta-pill">⏱ 30 mins</span>
              <span class="ast-cal-meta-pill" id="ast-cal-banner-branch">📍 Shah Faisal Colony</span>
            </div>
          </div>

          <!-- Calendar & Slots Split View -->
          <div class="ast-cal-grid-layout">
            <!-- Left Panel: Monthly Interactive Calendar -->
            <div class="ast-cal-left-panel">
              <div class="ast-cal-month-header">
                <span class="ast-cal-month-name" id="ast-cal-month-title">October 2026</span>
                <div class="ast-cal-month-nav-btns">
                  <button type="button" class="ast-cal-nav-btn" id="ast-btn-prev-month" aria-label="Previous Month">&lsaquo;</button>
                  <button type="button" class="ast-cal-nav-btn" id="ast-btn-next-month" aria-label="Next Month">&rsaquo;</button>
                </div>
              </div>

              <div class="ast-cal-weekdays">
                <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
              </div>

              <div class="ast-cal-days-grid" id="ast-cal-days-box" role="grid">
                <!-- Dynamically populated month days -->
              </div>

              <div class="ast-cal-legend">
                <div class="ast-legend-item"><span class="ast-legend-dot active"></span> Selected</div>
                <div class="ast-legend-item"><span class="ast-legend-dot avail"></span> Available</div>
                <div class="ast-legend-item"><span class="ast-legend-dot closed"></span> Sunday (Closed)</div>
              </div>
            </div>

            <!-- Right Panel: Vertical Time Slots -->
            <div class="ast-cal-right-panel">
              <div class="ast-slots-header">
                <span class="ast-slots-day-title" id="ast-cal-date-label">Wednesday, Oct 14</span>
                <span class="ast-slots-tz-note">Karachi Time (PKT, UTC+5)</span>
              </div>

              <div class="ast-slots-scroll-area" id="ast-slots-box" role="radiogroup" aria-label="Consultation Time Slots">
                <!-- Dynamically populated time slot pills -->
              </div>

              <div id="ast-slots-notice-box" class="ast-slots-empty-notice" style="display:none;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 4: PATIENT DETAILS -->
      <div class="ast-step-pane" id="ast-step-4">
        <div class="ast-pane-header">
          <h4 class="ast-pane-title">4. Patient Information</h4>
          <p class="ast-pane-desc">Please provide your contact details so our reception desk can reserve your appointment:</p>
        </div>

        <div class="ast-form-item" id="ast-group-name">
          <label for="ast-patient-name" class="ast-field-label">Full Name <span class="req">*</span></label>
          <input type="text" id="ast-patient-name" class="ast-text-input" placeholder="e.g. Fatima Khan" required autocomplete="name">
          <div class="ast-validation-error">Please enter your full name.</div>
        </div>

        <div class="ast-form-item" id="ast-group-phone">
          <label for="ast-patient-phone" class="ast-field-label">WhatsApp Number <span class="req">*</span></label>
          <input type="tel" id="ast-patient-phone" class="ast-text-input" placeholder="0316 2222983 or +92 316 2222983" required autocomplete="tel">
          <div class="ast-field-hint">Pakistani numbers: 03XX XXXXXXX or +92 3XX XXXXXXX (active WhatsApp number)</div>
          <div class="ast-validation-error">Please enter a valid Pakistani phone number.</div>
        </div>

        <div class="ast-form-item">
          <label for="ast-patient-notes" class="ast-field-label">Specific Concerns / Preferred Timings (Optional)</label>
          <textarea id="ast-patient-notes" class="ast-text-area" rows="3" placeholder="Tell us about your skin concerns, past treatments, or any specific doctor timing preferences..."></textarea>
        </div>
      </div>

      <!-- STEP 5: CONFIRMATION -->
      <div class="ast-step-pane" id="ast-step-5">
        <div class="ast-pane-header">
          <h4 class="ast-pane-title">5. Review & Confirm Booking</h4>
          <p class="ast-pane-desc">Please review your consultation request details below before sending directly to our clinic desk:</p>
        </div>

        <div class="ast-voucher-card" id="ast-confirmation-voucher">
          <!-- Populated dynamically -->
        </div>

        <div class="ast-wa-cta-container">
          <p>Click below to open WhatsApp with your prefilled appointment details. Our clinic reception will immediately log and confirm your slot.</p>
          <a href="#" id="ast-wa-confirm-btn" class="ast-btn-whatsapp-confirm" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span>Confirm & Open WhatsApp</span>
          </a>
          <div class="ast-wa-backup-status" id="ast-api-status-note">
            <span>✓ Ready to send to clinic WhatsApp</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer Navigation -->
    <div class="ast-booking-footer-nav">
      <button type="button" class="ast-nav-btn ast-nav-btn-prev" id="ast-btn-back" style="display: none;">
        &larr; Back
      </button>
      <button type="button" class="ast-nav-btn ast-nav-btn-next" id="ast-btn-continue">
        Continue &rarr;
      </button>
    </div>
  `;

  // Grab Elements
  var stepPanes = container.querySelectorAll('.ast-step-pane');
  var stepButtons = container.querySelectorAll('.ast-step-btn');
  var stepperLineFill = container.querySelector('#ast-stepper-line');
  var mobileStepLabel = container.querySelector('#ast-mobile-step-label');
  var btnBack = container.querySelector('#ast-btn-back');
  var btnContinue = container.querySelector('#ast-btn-continue');

  var branchGridEl = container.querySelector('.ast-branch-select-grid');
  var serviceSelectEl = container.querySelector('#ast-service-select');
  var servicePreviewEl = container.querySelector('#ast-service-preview');

  // Step 3 Elements
  var calBannerService = container.querySelector('#ast-cal-banner-service');
  var calBannerBranch = container.querySelector('#ast-cal-banner-branch');
  var calMonthTitle = container.querySelector('#ast-cal-month-title');
  var btnPrevMonth = container.querySelector('#ast-btn-prev-month');
  var btnNextMonth = container.querySelector('#ast-btn-next-month');
  var calDaysBox = container.querySelector('#ast-cal-days-box');
  var calDateLabel = container.querySelector('#ast-cal-date-label');
  var slotsBox = container.querySelector('#ast-slots-box');
  var slotsNoticeBox = container.querySelector('#ast-slots-notice-box');

  // Step 4 Elements
  var inputName = container.querySelector('#ast-patient-name');
  var inputPhone = container.querySelector('#ast-patient-phone');
  var inputNotes = container.querySelector('#ast-patient-notes');
  var groupName = container.querySelector('#ast-group-name');
  var groupPhone = container.querySelector('#ast-group-phone');

  // Step 5 Elements
  var voucherCard = container.querySelector('#ast-confirmation-voucher');
  var btnWaConfirm = container.querySelector('#ast-wa-confirm-btn');
  var apiStatusNote = container.querySelector('#ast-api-status-note');

  // ==========================================================================
  // RENDER STEP 1: BRANCHES
  // ==========================================================================
  function renderBranches() {
    branchGridEl.innerHTML = '';
    var branches = config.getAllBranches();
    branches.forEach(function (b) {
      var isSelected = b.id === state.branchId;
      var card = document.createElement('div');
      card.className = 'ast-branch-select-card' + (isSelected ? ' selected' : '');
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.setAttribute('tabindex', '0');
      card.setAttribute('data-branch-id', b.id);

      card.innerHTML = `
        <div class="ast-radio-ring">
          <div class="ast-radio-pill"></div>
        </div>
        <div class="ast-branch-select-details">
          <div class="ast-branch-select-top">
            <span class="ast-branch-select-name">${b.name}</span>
            <span class="ast-branch-badge-pill">${b.hours.short}</span>
          </div>
          <div class="ast-branch-select-addr">${b.address}</div>
          <div class="ast-branch-select-meta">
            <span>📞 ${b.primaryPhone}</span>
            <span>💬 WhatsApp Available</span>
            <span>⏱ 30-min Consultations</span>
          </div>
        </div>
      `;

      function selectBranch() {
        state.branchId = b.id;
        branchGridEl.querySelectorAll('.ast-branch-select-card').forEach(function(c) {
          c.classList.remove('selected');
          c.setAttribute('aria-checked', 'false');
        });
        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
        updateStep3Context();
        renderTimeSlots();
      }

      card.addEventListener('click', selectBranch);
      card.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          selectBranch();
        }
      });

      branchGridEl.appendChild(card);
    });
  }

  // ==========================================================================
  // RENDER STEP 2: SERVICES
  // ==========================================================================
  function renderServices() {
    serviceSelectEl.innerHTML = '';
    config.services.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name + (s.durationMinutes ? ' (~' + s.durationMinutes + ' mins)' : '');
      if (s.id === state.serviceId) opt.selected = true;
      serviceSelectEl.appendChild(opt);
    });
    updateServicePreview();
  }

  function updateServicePreview() {
    var selected = config.services.find(function(s) { return s.id === state.serviceId; });
    if (selected) {
      state.serviceName = selected.name;
      servicePreviewEl.innerHTML = `
        <strong>${selected.name}</strong>
        <span>Consultation slot duration: ~${selected.durationMinutes || 30} minutes. Medical aesthetic evaluation with Dr. Samina Habib including personalized skin treatment planning.</span>
      `;
      updateStep3Context();
    }
  }

  serviceSelectEl.addEventListener('change', function () {
    state.serviceId = serviceSelectEl.value;
    updateServicePreview();
  });

  // ==========================================================================
  // STEP 3: CAL.COM CALENDAR & TIME SLOTS
  // ==========================================================================
  function updateStep3Context() {
    var branch = config.getBranch(state.branchId);
    if (calBannerBranch && branch) {
      calBannerBranch.textContent = '📍 ' + branch.name;
    }
    if (calBannerService) {
      calBannerService.textContent = state.serviceName;
    }
  }

  function renderCalendar() {
    calMonthTitle.textContent = MONTH_NAMES[state.viewMonth] + ' ' + state.viewYear;

    // Prev button disable if at or before current month
    var isCurrentMonth = state.viewYear === todayYear && state.viewMonth === todayMonth;
    btnPrevMonth.disabled = isCurrentMonth;

    calDaysBox.innerHTML = '';

    // First day index (0 = Sun, 1 = Mon, ..., 6 = Sat)
    var firstDayIndex = new Date(state.viewYear, state.viewMonth, 1).getDay();
    var daysInMonth = new Date(state.viewYear, state.viewMonth + 1, 0).getDate();

    // Leading empty cells
    for (var i = 0; i < firstDayIndex; i++) {
      var emptyCell = document.createElement('div');
      emptyCell.className = 'ast-cal-day-cell empty';
      calDaysBox.appendChild(emptyCell);
    }

    // Days in Month
    for (var day = 1; day <= daysInMonth; day++) {
      var cellDate = new Date(state.viewYear, state.viewMonth, day);
      var dayOfWeek = cellDate.getDay();
      var dateString = formatYMD(cellDate);

      var isPast = false;
      var isSunday = (dayOfWeek === 0);
      var isToday = (state.viewYear === todayYear && state.viewMonth === todayMonth && day === todayDate);
      var isSelected = (dateString === state.date);

      // Check if past date
      var compareToday = new Date(todayYear, todayMonth, todayDate);
      if (cellDate < compareToday) {
        isPast = true;
      }

      var dayBtn = document.createElement('button');
      dayBtn.type = 'button';
      dayBtn.className = 'ast-cal-day-cell';
      dayBtn.setAttribute('data-date', dateString);

      if (isSunday) {
        dayBtn.classList.add('sunday-closed');
        dayBtn.disabled = true;
        dayBtn.setAttribute('title', 'The Asthetik is closed on Sundays');
        dayBtn.innerHTML = `<span>${day}</span><small>Closed</small>`;
      } else if (isPast) {
        dayBtn.classList.add('past');
        dayBtn.disabled = true;
        dayBtn.setAttribute('title', 'Past date');
        dayBtn.innerHTML = `<span>${day}</span>`;
      } else {
        dayBtn.classList.add('available');
        if (isToday) dayBtn.classList.add('is-today');
        if (isSelected) dayBtn.classList.add('selected');
        dayBtn.innerHTML = `<span>${day}</span>`;

        (function (ds, el) {
          el.addEventListener('click', function () {
            state.date = ds;
            state.timeSlot = ''; // Reset selected slot
            calDaysBox.querySelectorAll('.ast-cal-day-cell').forEach(function(c) {
              c.classList.remove('selected');
            });
            el.classList.add('selected');
            renderTimeSlots();
            checkCanContinue();
          });
        })(dateString, dayBtn);
      }

      calDaysBox.appendChild(dayBtn);
    }

    renderTimeSlots();
  }

  // Prev / Next Month Nav
  btnPrevMonth.addEventListener('click', function() {
    if (state.viewMonth === 0) {
      state.viewYear--;
      state.viewMonth = 11;
    } else {
      state.viewMonth--;
    }
    renderCalendar();
  });

  btnNextMonth.addEventListener('click', function() {
    if (state.viewMonth === 11) {
      state.viewYear++;
      state.viewMonth = 0;
    } else {
      state.viewMonth++;
    }
    renderCalendar();
  });

  // Render Time Slots on Right Panel
  function renderTimeSlots() {
    slotsBox.innerHTML = '';
    slotsNoticeBox.style.display = 'none';

    var branch = config.getBranch(state.branchId);
    if (!branch) return;

    if (!state.date) {
      calDateLabel.textContent = 'Select a Date';
      slotsNoticeBox.textContent = 'Please choose an available date on the calendar.';
      slotsNoticeBox.style.display = 'block';
      return;
    }

    // Format Selected Date Heading (e.g. Wednesday, Oct 14)
    var dateParts = state.date.split('-');
    var chosenDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    var dayOfWeek = chosenDate.getDay();

    var dayName = DAY_NAMES[dayOfWeek];
    var monthShort = MONTH_NAMES[chosenDate.getMonth()].substr(0, 3);
    calDateLabel.textContent = dayName + ', ' + monthShort + ' ' + chosenDate.getDate();

    if (dayOfWeek === 0) {
      slotsNoticeBox.innerHTML = `<strong>Clinic Closed on Sundays</strong><br>Our reception desks are closed on Sundays. Please select Monday through Saturday.`;
      slotsNoticeBox.style.display = 'block';
      state.timeSlot = '';
      checkCanContinue();
      return;
    }

    var now = new Date();
    var isChosenToday = chosenDate.toDateString() === now.toDateString();
    var curHour = now.getHours();
    var curMinute = now.getMinutes();

    var h = branch.hours.startHour;
    var m = branch.hours.startMinute;
    var endH = branch.hours.endHour;
    var endM = branch.hours.endMinute;
    var slotDuration = branch.hours.slotDurationMinutes || 30;

    var availableCount = 0;

    while (h < endH || (h === endH && m < endM)) {
      var slotLabel = formatTime12h(h, m);
      var isPastSlot = false;

      if (isChosenToday) {
        if (h < curHour || (h === curHour && m <= curMinute + 15)) {
          isPastSlot = true;
        }
      }

      var slotBtn = document.createElement('button');
      slotBtn.type = 'button';
      slotBtn.className = 'ast-cal-slot-btn' + (state.timeSlot === slotLabel ? ' selected' : '');
      slotBtn.setAttribute('role', 'radio');
      slotBtn.setAttribute('aria-checked', state.timeSlot === slotLabel ? 'true' : 'false');
      slotBtn.innerHTML = `<span>${slotLabel}</span><span class="slot-check">✓</span>`;

      if (isPastSlot) {
        slotBtn.disabled = true;
      } else {
        availableCount++;
        (function (timeStr, el) {
          el.addEventListener('click', function () {
            state.timeSlot = timeStr;
            slotsBox.querySelectorAll('.ast-cal-slot-btn').forEach(function(b) {
              b.classList.remove('selected');
              b.setAttribute('aria-checked', 'false');
            });
            el.classList.add('selected');
            el.setAttribute('aria-checked', 'true');
            checkCanContinue();
          });
        })(slotLabel, slotBtn);
      }

      slotsBox.appendChild(slotBtn);

      m += slotDuration;
      if (m >= 60) {
        h += Math.floor(m / 60);
        m = m % 60;
      }
    }

    if (availableCount === 0 && isChosenToday) {
      slotsNoticeBox.innerHTML = `<strong>No more slots for today</strong><br>Hours for ${branch.name} are ${branch.hours.short}. Please pick an upcoming date from the calendar.`;
      slotsNoticeBox.style.display = 'block';
      state.timeSlot = '';
    }

    checkCanContinue();
  }

  // ==========================================================================
  // STEP 4: PATIENT DETAILS VALIDATION
  // ==========================================================================
  function validateDetails() {
    var valid = true;
    var nameVal = inputName.value.trim();
    var phoneVal = inputPhone.value.trim();

    if (!nameVal) {
      groupName.classList.add('ast-has-error');
      valid = false;
    } else {
      groupName.classList.remove('ast-has-error');
      state.name = nameVal;
    }

    if (!isValidPakistaniPhone(phoneVal)) {
      groupPhone.classList.add('ast-has-error');
      valid = false;
    } else {
      groupPhone.classList.remove('ast-has-error');
      state.phone = phoneVal;
    }

    state.notes = inputNotes.value.trim();
    return valid;
  }

  inputName.addEventListener('input', function() {
    if (inputName.value.trim()) groupName.classList.remove('ast-has-error');
    checkCanContinue();
  });

  inputPhone.addEventListener('input', function() {
    if (isValidPakistaniPhone(inputPhone.value.trim())) groupPhone.classList.remove('ast-has-error');
    checkCanContinue();
  });

  // ==========================================================================
  // STEP 5: CONFIRMATION & WHATSAPP GENERATION
  // ==========================================================================
  function renderConfirmation() {
    var branch = config.getBranch(state.branchId);

    voucherCard.innerHTML = `
      <div class="ast-voucher-header">
        <span class="ast-voucher-badge">✓ Consultation Request</span>
        <span class="ast-voucher-clinic">${branch.name}</span>
      </div>

      <div class="ast-voucher-row">
        <span class="ast-voucher-label">Doctor</span>
        <span class="ast-voucher-value">Dr. Samina Habib</span>
      </div>
      <div class="ast-voucher-row">
        <span class="ast-voucher-label">Treatment</span>
        <span class="ast-voucher-value gold">${state.serviceName}</span>
      </div>
      <div class="ast-voucher-row">
        <span class="ast-voucher-label">Appointment Date</span>
        <span class="ast-voucher-value">${state.date}</span>
      </div>
      <div class="ast-voucher-row">
        <span class="ast-voucher-label">Reserved Time</span>
        <span class="ast-voucher-value gold">${state.timeSlot} (PKT)</span>
      </div>
      <div class="ast-voucher-row">
        <span class="ast-voucher-label">Patient Name</span>
        <span class="ast-voucher-value">${state.name}</span>
      </div>
      <div class="ast-voucher-row">
        <span class="ast-voucher-label">WhatsApp Contact</span>
        <span class="ast-voucher-value">${state.phone}</span>
      </div>
      ${state.notes ? `
      <div class="ast-voucher-row">
        <span class="ast-voucher-label">Notes</span>
        <span class="ast-voucher-value" style="font-size:0.84rem; color:#cbd5e1;">${state.notes}</span>
      </div>` : ''}
      <div class="ast-voucher-row">
        <span class="ast-voucher-label">Clinic Location</span>
        <span class="ast-voucher-value" style="font-size:0.82rem; color:#94a3b8;">${branch.address}</span>
      </div>
    `;

    // Construct prefilled WhatsApp link
    var waLink = config.buildWhatsAppUrl(state.branchId, {
      service: state.serviceName,
      date: state.date,
      time: state.timeSlot,
      name: state.name,
      phone: state.phone,
      notes: state.notes
    });

    btnWaConfirm.href = waLink;

    // Trigger backup POST to server.js
    if (!state.backupSaved) {
      sendBackupBooking();
    }
  }

  function sendBackupBooking() {
    var payload = {
      branchId: state.branchId,
      serviceName: state.serviceName,
      date: state.date,
      timeSlot: state.timeSlot,
      name: state.name,
      phone: state.phone,
      notes: state.notes
    };

    fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.success) {
        state.backupSaved = true;
        apiStatusNote.innerHTML = `<span>✓ Logged in clinic booking system (Ref: #${data.bookingId})</span>`;
      }
    })
    .catch(function (err) {
      console.warn('Backup booking API logging skipped:', err);
    });
  }

  // ==========================================================================
  // STEPPER NAVIGATION LOGIC
  // ==========================================================================
  var STEP_TITLES = [
    'Branch',
    'Service',
    'Date & Time',
    'Details',
    'Confirm'
  ];

  function updateStepperUI() {
    var pct = ((state.currentStep - 1) / (stepButtons.length - 1)) * 100;
    stepperLineFill.style.width = pct + '%';

    stepButtons.forEach(function (btn) {
      var stepNum = parseInt(btn.getAttribute('data-step'), 10);
      var numSpan = btn.querySelector('.ast-step-num');

      btn.classList.remove('active', 'completed');

      if (stepNum === state.currentStep) {
        btn.classList.add('active');
        numSpan.textContent = stepNum;
      } else if (stepNum < state.currentStep) {
        btn.classList.add('completed');
        numSpan.textContent = '✓';
      } else {
        numSpan.textContent = stepNum;
      }
    });

    mobileStepLabel.textContent = 'Step ' + state.currentStep + ' of 5 • ' + STEP_TITLES[state.currentStep - 1];

    stepPanes.forEach(function (pane, idx) {
      pane.classList.toggle('active', (idx + 1) === state.currentStep);
    });

    btnBack.style.display = state.currentStep > 1 ? 'inline-flex' : 'none';

    if (state.currentStep === 5) {
      btnContinue.style.display = 'none';
    } else {
      btnContinue.style.display = 'inline-flex';
      btnContinue.textContent = (state.currentStep === 4) ? 'Review Booking →' : 'Continue →';
    }

    checkCanContinue();
  }

  function checkCanContinue() {
    var canContinue = true;
    if (state.currentStep === 1) {
      canContinue = !!state.branchId;
    } else if (state.currentStep === 2) {
      canContinue = !!state.serviceId;
    } else if (state.currentStep === 3) {
      canContinue = !!(state.date && state.timeSlot);
    } else if (state.currentStep === 4) {
      var n = inputName.value.trim();
      var p = inputPhone.value.trim();
      canContinue = !!(n && isValidPakistaniPhone(p));
    }
    btnContinue.disabled = !canContinue;
  }

  btnContinue.addEventListener('click', function () {
    if (state.currentStep === 4) {
      if (!validateDetails()) return;
      state.currentStep = 5;
      renderConfirmation();
      updateStepperUI();
    } else if (state.currentStep < 5) {
      state.currentStep++;
      updateStepperUI();
    }
  });

  btnBack.addEventListener('click', function () {
    if (state.currentStep > 1) {
      state.currentStep--;
      updateStepperUI();
    }
  });

  // Enable step button clicking for completed steps
  stepButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetStep = parseInt(btn.getAttribute('data-step'), 10);
      if (targetStep < state.currentStep) {
        state.currentStep = targetStep;
        updateStepperUI();
      }
    });
  });

  // Initialize App
  renderBranches();
  renderServices();
  renderCalendar();
  updateStepperUI();
});

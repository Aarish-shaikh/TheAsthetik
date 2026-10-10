/**
 * The Asthetik - Calendly-Style Multi-Step Booking Flow
 * Reads from CLINIC_CONFIG, generates branch-specific 30-minute slots, validates Pakistani numbers,
 * triggers WhatsApp prefilled message, and posts to backup API.
 */
document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('asthetik-booking-app');
  if (!container) return;

  var config = window.CLINIC_CONFIG;
  if (!config) {
    console.error('CLINIC_CONFIG not found.');
    return;
  }

  // Booking State
  var state = {
    currentStep: 1,
    branchId: 'shah-faisal-colony',
    serviceId: config.services[0].id,
    serviceName: config.services[0].name,
    date: '',
    timeSlot: '',
    name: '',
    phone: '',
    notes: '',
    backupSaved: false
  };

  // Check URL parameters for preselected branch (e.g. ?branch=dha)
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

  // Helper: Get today in YYYY-MM-DD
  function getTodayString() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  // Set initial default date (today, or tomorrow if today is Sunday)
  var initialDate = new Date();
  if (initialDate.getDay() === 0) {
    initialDate.setDate(initialDate.getDate() + 1);
  }
  var initYear = initialDate.getFullYear();
  var initMonth = String(initialDate.getMonth() + 1).padStart(2, '0');
  var initDay = String(initialDate.getDate()).padStart(2, '0');
  state.date = initYear + '-' + initMonth + '-' + initDay;

  // Validate Pakistani Phone format
  function isValidPakistaniPhone(phoneStr) {
    if (!phoneStr) return false;
    // Strip spaces, dashes, parentheses
    var cleaned = phoneStr.replace(/[\s\-\(\)]/g, '');
    // Standard formats:
    // Mobile: 03XX XXXXXXX (11 digits) or +923XX XXXXXXX or 923XX XXXXXXX (12 digits)
    // Landline: 021 XXXXXXXX (10-11 digits) or +9221 XXXXXXXX
    var mobileRegex = /^(?:\+92|92|0)?3[0-9]{9}$/;
    var landlineRegex = /^(?:\+92|92|0)?(?:21|42|51)[0-9]{7,8}$/;
    return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
  }

  // Render Skeleton UI
  container.innerHTML = `
    <div class="ast-booking-header">
      <h3 class="ast-booking-title">Book a Consultation</h3>
      <p class="ast-booking-subtitle">Personalised aesthetic care with Dr. Samina Habib</p>
      
      <div class="ast-progress-bar" role="progressbar" aria-label="Booking Progress" aria-valuemin="1" aria-valuemax="5" aria-valuenow="1">
        <div class="ast-progress-fill" id="ast-progress-fill" style="width: 0%;"></div>
        
        <button type="button" class="ast-progress-step active" data-step="1" aria-label="Step 1: Choose Branch">
          <span class="ast-step-bubble">1</span>
          <span class="ast-step-label">Branch</span>
        </button>
        <button type="button" class="ast-progress-step" data-step="2" aria-label="Step 2: Choose Service">
          <span class="ast-step-bubble">2</span>
          <span class="ast-step-label">Service</span>
        </button>
        <button type="button" class="ast-progress-step" data-step="3" aria-label="Step 3: Date & Time">
          <span class="ast-step-bubble">3</span>
          <span class="ast-step-label">Time</span>
        </button>
        <button type="button" class="ast-progress-step" data-step="4" aria-label="Step 4: Your Details">
          <span class="ast-step-bubble">4</span>
          <span class="ast-step-label">Details</span>
        </button>
        <button type="button" class="ast-progress-step" data-step="5" aria-label="Step 5: Confirm">
          <span class="ast-step-bubble">5</span>
          <span class="ast-step-label">Confirm</span>
        </button>
      </div>
    </div>

    <div class="ast-step-container" aria-live="polite">
      <!-- STEP 1: BRANCH -->
      <div class="ast-step-pane active" id="ast-step-1">
        <h4 class="ast-pane-heading">1. Select Clinic Branch</h4>
        <p class="ast-pane-desc">Choose which of our two Karachi clinics you would like to visit:</p>
        <div class="ast-branch-list" role="radiogroup" aria-label="Select Clinic Branch">
          <!-- Populated dynamically -->
        </div>
      </div>

      <!-- STEP 2: SERVICE -->
      <div class="ast-step-pane" id="ast-step-2">
        <h4 class="ast-pane-heading">2. Select Treatment or Consultation</h4>
        <p class="ast-pane-desc">Select the treatment you are interested in. If you are unsure, choose Initial Skin Consultation.</p>
        <div class="ast-form-group">
          <label for="ast-service-select" class="ast-label">Treatment / Service</label>
          <select id="ast-service-select" class="ast-select" aria-label="Select Treatment">
            <!-- Populated dynamically -->
          </select>
          <div class="ast-service-preview-card" id="ast-service-info">
            <!-- Service preview -->
          </div>
        </div>
      </div>

      <!-- STEP 3: DATE & TIME -->
      <div class="ast-step-pane" id="ast-step-3">
        <h4 class="ast-pane-heading">3. Choose Appointment Date & Time</h4>
        <p class="ast-pane-desc">Select a date to view available 30-minute consultation slots:</p>
        
        <div class="ast-date-time-grid">
          <div class="ast-form-group">
            <label for="ast-date-input" class="ast-label">Preferred Date</label>
            <input type="date" id="ast-date-input" class="ast-input" min="${getTodayString()}" value="${state.date}" aria-label="Appointment Date">
          </div>

          <div class="ast-slots-section">
            <label class="ast-slots-label" id="ast-slots-title">Available Time Slots</label>
            <div id="ast-slots-container" class="ast-slots-grid" role="radiogroup" aria-labelledby="ast-slots-title">
              <!-- Time slots populated dynamically -->
            </div>
            <div id="ast-slots-warning" class="ast-slots-notice" style="display: none;"></div>
          </div>
        </div>
      </div>

      <!-- STEP 4: DETAILS -->
      <div class="ast-step-pane" id="ast-step-4">
        <h4 class="ast-pane-heading">4. Patient Information</h4>
        <p class="ast-pane-desc">Please provide your contact details so our clinic team can confirm your appointment:</p>
        
        <div class="ast-form-group" id="group-patient-name">
          <label for="ast-patient-name" class="ast-label">Full Name <span style="color:var(--asthetik-gold);">*</span></label>
          <input type="text" id="ast-patient-name" class="ast-input" placeholder="e.g. Fatima Khan" required autocomplete="name">
          <div class="ast-error-msg">Please enter your full name.</div>
        </div>

        <div class="ast-form-group" id="group-patient-phone">
          <label for="ast-patient-phone" class="ast-label">Phone Number (WhatsApp) <span style="color:var(--asthetik-gold);">*</span></label>
          <input type="tel" id="ast-patient-phone" class="ast-input" placeholder="0316 2222983 or +92 316 2222983" required autocomplete="tel">
          <div class="ast-input-hint">Format: 03XX XXXXXXX or +92 3XX XXXXXXX (active WhatsApp number)</div>
          <div class="ast-error-msg">Please enter a valid Pakistani phone number.</div>
        </div>

        <div class="ast-form-group">
          <label for="ast-patient-notes" class="ast-label">Specific Concerns / Notes (Optional)</label>
          <textarea id="ast-patient-notes" class="ast-textarea" rows="3" placeholder="Tell us about your skin concerns, previous treatments, or preferred doctor timings..."></textarea>
        </div>
      </div>

      <!-- STEP 5: CONFIRMATION -->
      <div class="ast-step-pane" id="ast-step-5">
        <h4 class="ast-pane-heading">5. Review & Confirm Booking</h4>
        <p class="ast-pane-desc">Review your consultation request below before sending it directly to our clinic desk:</p>
        
        <div class="ast-summary-card" id="ast-booking-summary">
          <!-- Summary populated dynamically -->
        </div>

        <div class="ast-whatsapp-cta-box" id="ast-wa-box">
          <p>Click below to open WhatsApp with your prefilled appointment details. Our reception desk will instantly receive and confirm your slot.</p>
          <a href="#" id="ast-btn-send-whatsapp" class="ast-btn-whatsapp" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span>Confirm & Open WhatsApp</span>
          </a>
          <div class="ast-backup-status" id="ast-backup-indicator">Booking logged to clinic system</div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="ast-booking-footer">
        <button type="button" class="ast-btn ast-btn-secondary" id="ast-btn-prev" style="display: none;">← Back</button>
        <button type="button" class="ast-btn ast-btn-primary" id="ast-btn-next" style="margin-left: auto;">Continue →</button>
      </div>
    </div>
  `;

  // Grab Elements
  var stepPanes = container.querySelectorAll('.ast-step-pane');
  var progressSteps = container.querySelectorAll('.ast-progress-step');
  var progressFill = container.querySelector('#ast-progress-fill');
  var btnPrev = container.querySelector('#ast-btn-prev');
  var btnNext = container.querySelector('#ast-btn-next');
  var branchListEl = container.querySelector('.ast-branch-list');
  var serviceSelectEl = container.querySelector('#ast-service-select');
  var serviceInfoEl = container.querySelector('#ast-service-info');
  var dateInputEl = container.querySelector('#ast-date-input');
  var slotsContainerEl = container.querySelector('#ast-slots-container');
  var slotsWarningEl = container.querySelector('#ast-slots-warning');
  var inputName = container.querySelector('#ast-patient-name');
  var inputPhone = container.querySelector('#ast-patient-phone');
  var inputNotes = container.querySelector('#ast-patient-notes');
  var summaryCard = container.querySelector('#ast-booking-summary');
  var btnSendWhatsApp = container.querySelector('#ast-btn-send-whatsapp');
  var waBox = container.querySelector('#ast-wa-box');
  var backupIndicator = container.querySelector('#ast-backup-indicator');

  // Populate Step 1: Branches
  function renderBranches() {
    branchListEl.innerHTML = '';
    var branches = config.getAllBranches();
    branches.forEach(function (b) {
      var isSelected = b.id === state.branchId;
      var card = document.createElement('div');
      card.className = 'ast-branch-card' + (isSelected ? ' selected' : '');
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.setAttribute('tabindex', '0');
      card.setAttribute('data-branch-id', b.id);

      card.innerHTML = `
        <div class="ast-radio-circle">
          <div class="ast-radio-dot"></div>
        </div>
        <div class="ast-branch-card-body">
          <div class="ast-branch-card-title">${b.name}</div>
          <span class="ast-branch-badge">${b.hours.short}</span>
          <div class="ast-branch-info-row">
            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span>${b.address}</span>
          </div>
          <div class="ast-branch-info-row">
            <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            <span>${b.primaryPhone}</span>
          </div>
        </div>
      `;

      function selectCard() {
        state.branchId = b.id;
        branchListEl.querySelectorAll('.ast-branch-card').forEach(function(c) {
          c.classList.remove('selected');
          c.setAttribute('aria-checked', 'false');
        });
        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
        renderSlots();
      }

      card.addEventListener('click', selectCard);
      card.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          selectCard();
        }
      });

      branchListEl.appendChild(card);
    });
  }

  // Populate Step 2: Services
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
      serviceInfoEl.innerHTML = `
        <strong>${selected.name}</strong><br>
        <span style="font-size:0.8rem;color:#94a3b8;">Consultation slot duration: ~${selected.durationMinutes || 30} minutes. Our clinic reception will reserve this slot exclusively for your visit.</span>
      `;
    }
  }

  serviceSelectEl.addEventListener('change', function () {
    state.serviceId = serviceSelectEl.value;
    updateServicePreview();
  });

  // Populate Step 3: 30-min Slots based on branch & day
  function renderSlots() {
    slotsContainerEl.innerHTML = '';
    slotsWarningEl.style.display = 'none';

    var branch = config.getBranch(state.branchId);
    if (!branch) return;

    if (!state.date) {
      slotsWarningEl.textContent = 'Please choose a date above.';
      slotsWarningEl.style.display = 'block';
      return;
    }

    // Check day of week
    var dateParts = state.date.split('-');
    var chosenDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    var dayOfWeek = chosenDate.getDay(); // 0 is Sunday

    if (dayOfWeek === 0) {
      slotsWarningEl.innerHTML = `<strong>Clinic Closed on Sundays</strong><br>Please select any date between Monday and Saturday.`;
      slotsWarningEl.style.display = 'block';
      state.timeSlot = '';
      return;
    }

    var now = new Date();
    var isToday = chosenDate.toDateString() === now.toDateString();
    var currentHour = now.getHours();
    var currentMinute = now.getMinutes();

    var h = branch.hours.startHour;
    var m = branch.hours.startMinute;
    var endH = branch.hours.endHour;
    var endM = branch.hours.endMinute;

    var totalSlotsGenerated = 0;
    var availableSlots = 0;

    while (h < endH || (h === endH && m < endM)) {
      var slotLabel = formatTime12h(h, m);
      var isPast = false;
      if (isToday) {
        if (h < currentHour || (h === currentHour && m <= currentMinute + 15)) {
          isPast = true;
        }
      }

      var pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'ast-slot-pill' + (isPast ? ' disabled' : '') + (state.timeSlot === slotLabel ? ' selected' : '');
      pill.setAttribute('role', 'radio');
      pill.setAttribute('aria-checked', state.timeSlot === slotLabel ? 'true' : 'false');
      pill.textContent = slotLabel;

      if (!isPast) {
        availableSlots++;
        (function (timeStr, el) {
          el.addEventListener('click', function () {
            state.timeSlot = timeStr;
            slotsContainerEl.querySelectorAll('.ast-slot-pill').forEach(function (p) {
              p.classList.remove('selected');
              p.setAttribute('aria-checked', 'false');
            });
            el.classList.add('selected');
            el.setAttribute('aria-checked', 'true');
          });
        })(slotLabel, pill);
      } else {
        pill.disabled = true;
        pill.setAttribute('aria-disabled', 'true');
      }

      slotsContainerEl.appendChild(pill);
      totalSlotsGenerated++;

      // Advance by 30 minutes
      m += branch.hours.slotDurationMinutes || 30;
      if (m >= 60) {
        h += Math.floor(m / 60);
        m = m % 60;
      }
    }

    if (availableSlots === 0 && isToday) {
      slotsWarningEl.innerHTML = `<strong>No more available slots today</strong> for this branch.<br>Clinic hours are ${branch.hours.short}. Please pick a future date.`;
      slotsWarningEl.style.display = 'block';
      state.timeSlot = '';
    }
  }

  dateInputEl.addEventListener('change', function () {
    state.date = dateInputEl.value;
    state.timeSlot = ''; // Reset selected slot on date change
    renderSlots();
  });

  // Step 4 Validation
  function validateDetails() {
    var isValid = true;
    var nameVal = inputName.value.trim();
    var phoneVal = inputPhone.value.trim();

    var groupName = container.querySelector('#group-patient-name');
    var groupPhone = container.querySelector('#group-patient-phone');

    if (!nameVal || nameVal.length < 2) {
      groupName.classList.add('ast-has-error');
      isValid = false;
    } else {
      groupName.classList.remove('ast-has-error');
      state.name = nameVal;
    }

    if (!isValidPakistaniPhone(phoneVal)) {
      groupPhone.classList.add('ast-has-error');
      isValid = false;
    } else {
      groupPhone.classList.remove('ast-has-error');
      state.phone = phoneVal;
    }

    state.notes = inputNotes.value.trim();
    return isValid;
  }

  // Populate Step 5: Summary
  function renderSummary() {
    var branch = config.getBranch(state.branchId);
    var dateFormatted = state.date;
    try {
      var dParts = state.date.split('-');
      var dObj = new Date(parseInt(dParts[0]), parseInt(dParts[1]) - 1, parseInt(dParts[2]));
      dateFormatted = dObj.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {}

    summaryCard.innerHTML = `
      <div class="ast-summary-row">
        <span class="ast-summary-label">Selected Branch:</span>
        <span class="ast-summary-value" style="color:var(--asthetik-gold);">${branch ? branch.name : state.branchId}</span>
      </div>
      <div class="ast-summary-row">
        <span class="ast-summary-label">Clinic Address:</span>
        <span class="ast-summary-value">${branch ? branch.address : ''}</span>
      </div>
      <div class="ast-summary-row">
        <span class="ast-summary-label">Treatment / Service:</span>
        <span class="ast-summary-value">${state.serviceName}</span>
      </div>
      <div class="ast-summary-row">
        <span class="ast-summary-label">Date & Time:</span>
        <span class="ast-summary-value" style="color:#ffffff; font-weight:700;">${dateFormatted} at ${state.timeSlot}</span>
      </div>
      <div class="ast-summary-row">
        <span class="ast-summary-label">Patient Name:</span>
        <span class="ast-summary-value">${state.name}</span>
      </div>
      <div class="ast-summary-row">
        <span class="ast-summary-label">Contact (WhatsApp):</span>
        <span class="ast-summary-value">${state.phone}</span>
      </div>
      ${state.notes ? `
      <div class="ast-summary-row">
        <span class="ast-summary-label">Notes:</span>
        <span class="ast-summary-value">${state.notes}</span>
      </div>` : ''}
    `;

    // WhatsApp URL
    var waUrl = config.getWhatsAppUrl({
      branchId: state.branchId,
      branchName: branch ? branch.name : state.branchId,
      serviceName: state.serviceName,
      date: state.date,
      dateFormatted: dateFormatted,
      timeSlot: state.timeSlot,
      name: state.name,
      phone: state.phone,
      notes: state.notes
    });

    if (waUrl) {
      btnSendWhatsApp.href = waUrl;
      btnSendWhatsApp.style.display = 'inline-flex';
    } else {
      // Unresolved / placeholder fallback
      btnSendWhatsApp.style.display = 'none';
      waBox.innerHTML = `
        <div style="padding:15px; background:rgba(197,168,128,0.1); border:1px solid var(--asthetik-gold); border-radius:8px;">
          <h5 style="margin:0 0 6px 0; color:var(--asthetik-gold);">Appointment Ready to Confirm</h5>
          <p style="margin:0; font-size:0.85rem; color:#e2e8f0;">
            Please call our clinic desk at <strong>${branch.primaryPhone}</strong> to confirm this booking.
          </p>
        </div>
      `;
    }

    // Trigger background backup POST to /api/book
    triggerBackupBooking(dateFormatted);
  }

  // Backup Booking API Call
  function triggerBackupBooking(dateFormatted) {
    backupIndicator.textContent = 'Recording booking to backup system...';
    var branch = config.getBranch(state.branchId);

    var payload = {
      branchId: state.branchId,
      branchName: branch ? branch.name : state.branchId,
      serviceId: state.serviceId,
      serviceName: state.serviceName,
      date: state.date,
      dateFormatted: dateFormatted,
      timeSlot: state.timeSlot,
      name: state.name,
      phone: state.phone,
      notes: state.notes,
      createdAt: new Date().toISOString()
    };

    fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        state.backupSaved = true;
        backupIndicator.textContent = '✓ Booking saved to clinic system. Tap WhatsApp button above to confirm.';
        backupIndicator.style.color = '#86efac';
      })
      .catch(function (err) {
        console.warn('Backup webhook notice:', err.message);
        backupIndicator.textContent = 'Tap WhatsApp button above to send your booking to the clinic desk.';
        backupIndicator.style.color = '#94a3b8';
      });
  }

  // Step Navigation
  function goToStep(step) {
    if (step < 1 || step > 5) return;

    // Validate step before advancing
    if (step > state.currentStep) {
      if (state.currentStep === 1 && !state.branchId) {
        alert('Please choose a branch.');
        return;
      }
      if (state.currentStep === 2 && !state.serviceId) {
        alert('Please select a service.');
        return;
      }
      if (state.currentStep === 3) {
        if (!state.date || !state.timeSlot) {
          alert('Please select an appointment date and an available time slot.');
          return;
        }
      }
      if (state.currentStep === 4) {
        if (!validateDetails()) {
          return;
        }
      }
    }

    state.currentStep = step;

    // Update Panes
    stepPanes.forEach(function (pane, idx) {
      if (idx + 1 === step) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Update Step Indicators
    progressSteps.forEach(function (stepEl, idx) {
      var stepNum = idx + 1;
      stepEl.classList.remove('active', 'completed');
      if (stepNum === step) {
        stepEl.classList.add('active');
      } else if (stepNum < step) {
        stepEl.classList.add('completed');
      }
    });

    // Update Progress Fill
    var fillPercent = ((step - 1) / 4) * 100;
    progressFill.style.width = fillPercent + '%';

    // Update Footer Buttons
    if (step === 1) {
      btnPrev.style.display = 'none';
      btnNext.style.display = 'inline-flex';
      btnNext.textContent = 'Select Service →';
    } else if (step === 2) {
      btnPrev.style.display = 'inline-flex';
      btnNext.style.display = 'inline-flex';
      btnNext.textContent = 'Select Date & Time →';
    } else if (step === 3) {
      btnPrev.style.display = 'inline-flex';
      btnNext.style.display = 'inline-flex';
      btnNext.textContent = 'Enter Details →';
    } else if (step === 4) {
      btnPrev.style.display = 'inline-flex';
      btnNext.style.display = 'inline-flex';
      btnNext.textContent = 'Review & Confirm →';
    } else if (step === 5) {
      btnPrev.style.display = 'inline-flex';
      btnNext.style.display = 'none';
      renderSummary();
    }

    // Scroll to widget top smoothly
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Button Listeners
  btnNext.addEventListener('click', function () {
    goToStep(state.currentStep + 1);
  });

  btnPrev.addEventListener('click', function () {
    goToStep(state.currentStep - 1);
  });

  // Step indicator clicks (only to previously completed steps or current)
  progressSteps.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetStep = parseInt(btn.getAttribute('data-step'));
      if (targetStep < state.currentStep) {
        goToStep(targetStep);
      }
    });
  });

  // Initial Boot
  renderBranches();
  renderServices();
  renderSlots();
  goToStep(1);
});

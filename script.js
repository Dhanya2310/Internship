(function () {
  "use strict";

  const form = document.getElementById("application-form");
  const steps = Array.from(document.querySelectorAll(".step"));
  const stepperItems = Array.from(document.querySelectorAll(".stepper__step"));
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const nextBtnLabel = document.getElementById("nextBtnLabel");
  const resumeInput = document.getElementById("resume");
  const resumeFileName = document.getElementById("resumeFileName");
  const reviewList = document.getElementById("reviewList");
  const successPanel = document.getElementById("successPanel");
  const startOverBtn = document.getElementById("startOverBtn");

  let currentStep = 1;
  const totalSteps = steps.length;

  const fieldLabels = {
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    location: "Location",
    linkedin: "LinkedIn Profile",
    motivation: "Why do you want to join us?",
    institution: "Institution Name",
    degree: "Degree / Course",
    gradYear: "Graduation Year",
    skills: "Key Skills"
  };

  // ---- Resume file name display ----
  resumeInput.addEventListener("change", () => {
    if (resumeInput.files && resumeInput.files.length > 0) {
      resumeFileName.textContent = resumeInput.files[0].name;
      resumeFileName.classList.add("has-file");
    } else {
      resumeFileName.textContent = "Upload your resume (PDF/DOC)";
      resumeFileName.classList.remove("has-file");
    }
  });

  // ---- Step visibility ----
  function showStep(stepNumber) {
    steps.forEach((panel) => {
      panel.classList.toggle(
        "is-active",
        Number(panel.dataset.stepPanel) === stepNumber
      );
    });

    stepperItems.forEach((item) => {
      const n = Number(item.dataset.step);
      item.classList.toggle("is-active", n === stepNumber);
      item.classList.toggle("is-complete", n < stepNumber);
    });

    backBtn.hidden = stepNumber === 1;
    nextBtnLabel.textContent =
      stepNumber === totalSteps ? "Submit Application" : "Save & Continue";

    if (stepNumber === totalSteps) {
      buildReview();
    }
  }

  // ---- Validation for the currently visible step ----
  function validateStep(stepNumber) {
    const panel = steps.find(
      (p) => Number(p.dataset.stepPanel) === stepNumber
    );
    if (!panel) return true;

    let valid = true;
    const requiredFields = panel.querySelectorAll("[required]");

    requiredFields.forEach((input) => {
      const field = input.closest(".field") || input.closest(".checkbox");
      clearError(field);

      if (input.type === "checkbox" && !input.checked) {
        valid = false;
        showError(field, "Please confirm before submitting.");
        return;
      }

      if (input.type !== "checkbox" && !input.value.trim()) {
        valid = false;
        showError(field, "This field is required.");
        return;
      }

      if (input.type === "email" && input.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value.trim())) {
          valid = false;
          showError(field, "Enter a valid email address.");
        }
      }
    });

    return valid;
  }

  function showError(field, message) {
    if (!field) return;
    field.classList.add("has-error");
    let msg = field.querySelector(".field-error");
    if (!msg) {
      msg = document.createElement("p");
      msg.className = "field-error";
      field.appendChild(msg);
    }
    msg.textContent = message;
  }

  function clearError(field) {
    if (!field) return;
    field.classList.remove("has-error");
    const msg = field.querySelector(".field-error");
    if (msg) msg.remove();
  }

  // ---- Build the review summary ----
  function buildReview() {
    reviewList.innerHTML = "";
    const formData = new FormData(form);
    let hasAny = false;

    Object.keys(fieldLabels).forEach((key) => {
      const value = (formData.get(key) || "").toString().trim();
      if (!value) return;
      hasAny = true;

      const item = document.createElement("div");
      item.className = "review-item";

      const dt = document.createElement("dt");
      dt.textContent = fieldLabels[key];

      const dd = document.createElement("dd");
      dd.textContent = value;

      item.appendChild(dt);
      item.appendChild(dd);
      reviewList.appendChild(item);
    });

    if (resumeInput.files && resumeInput.files.length > 0) {
      hasAny = true;
      const item = document.createElement("div");
      item.className = "review-item";
      const dt = document.createElement("dt");
      dt.textContent = "Resume / CV";
      const dd = document.createElement("dd");
      dd.textContent = resumeInput.files[0].name;
      item.appendChild(dt);
      item.appendChild(dd);
      reviewList.appendChild(item);
    }

    if (!hasAny) {
      const empty = document.createElement("p");
      empty.className = "review-list__empty";
      empty.textContent = "No details entered yet — go back and fill in the form.";
      reviewList.appendChild(empty);
    }
  }

  // ---- Navigation ----
  backBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep -= 1;
      showStep(currentStep);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    if (currentStep < totalSteps) {
      currentStep += 1;
      showStep(currentStep);
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Final submit
      form.hidden = true;
      successPanel.hidden = false;
      successPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  startOverBtn.addEventListener("click", () => {
    form.reset();
    resumeFileName.textContent = "Upload your resume (PDF/DOC)";
    resumeFileName.classList.remove("has-file");
    currentStep = 1;
    showStep(currentStep);
    successPanel.hidden = true;
    form.hidden = false;
  });

  // ---- Init ----
  showStep(currentStep);
})();
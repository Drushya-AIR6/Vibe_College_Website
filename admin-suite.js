/**
 * Vibe College - Fleet Command & Admin Power-Tools Suite
 * Real-time BroadcastChannel sync across tabs, pure Canvas visual analytics, and CSV manifest export.
 */

(function () {
  'use strict';

  // ==============================================================
  // 1. REAL-TIME MULTI-TAB SYNCHRONIZATION (BroadcastChannel API)
  // ==============================================================
  let fleetChannel = null;
  if ('BroadcastChannel' in window) {
    fleetChannel = new BroadcastChannel('vibe_fleet_broadcast');

    fleetChannel.onmessage = (event) => {
      const data = event.data;
      if (!data || !data.type) return;

      console.log('⚓ Received Fleet Broadcast:', data);

      if (data.type === 'ADMISSION_PROCESSED' || data.type === 'MEMBER_UPDATED') {
        if (typeof renderAdminAdmissionsDesk === 'function') renderAdminAdmissionsDesk();
        if (typeof renderAdminMembersRoster === 'function') renderAdminMembersRoster();
        if (typeof renderAnalyticsCharts === 'function') renderAnalyticsCharts();
        showFleetBroadcastToast(data.message || 'Admissions & Member Manifest updated by Admiralty.');
      } else if (data.type === 'ENROLLMENT_PROCESSED') {
        if (typeof renderAdminEnrollmentsDesk === 'function') renderAdminEnrollmentsDesk();
        if (typeof renderStudentCourseBerths === 'function') renderStudentCourseBerths();
        if (typeof renderAnalyticsCharts === 'function') renderAnalyticsCharts();
        showFleetBroadcastToast(data.message || 'Subject Berth status updated across the fleet.');
      } else if (data.type === 'FLEET_NOTICE') {
        const annText = document.querySelector('#announcement-text');
        if (annText && data.text) {
          annText.textContent = data.text;
        }
        showFleetBroadcastToast(`🚨 FLEET ADVISORY: ${data.text}`);
      }
    };
  }

  function broadcastFleetEvent(type, payload = {}) {
    if (fleetChannel) {
      fleetChannel.postMessage({ type, ...payload, timestamp: Date.now() });
    }
  }

  function showFleetBroadcastToast(msg) {
    let toast = document.querySelector('#vibe-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'vibe-toast';
      toast.className = 'vibe-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4500);
  }

  // ==============================================================
  // 2. INTERACTIVE VISUAL ANALYTICS CHARTS (admin.html)
  // ==============================================================
  function renderAnalyticsCharts() {
    renderEnrollmentDonutChart();
    renderAdmissionsBarChart();
  }

  function renderEnrollmentDonutChart() {
    const canvas = document.querySelector('#chart-dept-donut');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = 280 * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);

    const slices = [
      { label: 'Computing Atoll', value: 45, color: '#27ae60' },
      { label: 'Mechanics Isle', value: 25, color: '#e67e22' },
      { label: 'Commerce Reef', value: 18, color: '#f1c40f' },
      { label: 'Cartography Cay', value: 12, color: '#9b59b6' },
    ];

    const cx = 95;
    const cy = 100;
    const radius = 70;
    const innerRadius = 42;

    ctx.clearRect(0, 0, 280, 200);

    let startAngle = -Math.PI / 2;
    slices.forEach((s) => {
      const sliceAngle = (s.value / 100) * (Math.PI * 2);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Center text
    ctx.font = 'bold 16px "DM Sans", sans-serif';
    ctx.fillStyle = '#f1c957';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('100%', cx, cy - 6);
    ctx.font = '9px "DM Sans", sans-serif';
    ctx.fillStyle = '#a4b5a2';
    ctx.fillText('Capacity', cx, cy + 10);

    // Legend on the right
    let legY = 35;
    ctx.textAlign = 'left';
    slices.forEach((s) => {
      ctx.fillStyle = s.color;
      ctx.fillRect(180, legY, 10, 10);
      ctx.fillStyle = '#e7dfce';
      ctx.font = '10px "DM Sans", sans-serif';
      ctx.fillText(`${s.label} (${s.value}%)`, 196, legY + 9);
      legY += 28;
    });
  }

  function renderAdmissionsBarChart() {
    const canvas = document.querySelector('#chart-admissions-bar');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = 300 * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);

    const raw = localStorage.getItem('vc_admissions_db');
    let approved = 1;
    let pending = 2;
    let rejected = 0;

    if (raw) {
      try {
        const list = JSON.parse(raw);
        approved = list.filter((a) => a.status === 'approved').length;
        pending = list.filter((a) => a.status === 'pending').length;
        rejected = list.filter((a) => a.status === 'rejected').length;
      } catch (e) {}
    }

    const data = [
      { label: 'Commissioned', count: approved, color: '#2ecc71' },
      { label: 'Under Review', count: pending, color: '#f39c12' },
      { label: 'Deferred', count: rejected, color: '#e74c3c' },
    ];

    ctx.clearRect(0, 0, 300, 200);

    const maxVal = Math.max(approved, pending, rejected, 5);
    const chartHeight = 130;
    const startX = 40;
    const barWidth = 45;
    const gap = 40;

    // Baseline
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX - 10, 155);
    ctx.lineTo(startX + 3 * (barWidth + gap) - gap + 10, 155);
    ctx.stroke();

    data.forEach((d, i) => {
      const bx = startX + i * (barWidth + gap);
      const h = (d.count / maxVal) * chartHeight;
      const by = 155 - h;

      // Draw Bar
      ctx.fillStyle = d.color;
      ctx.fillRect(bx, by, barWidth, h);

      // Value text on top
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(d.count), bx + barWidth / 2, by - 6);

      // Label below
      ctx.fillStyle = '#9bb09b';
      ctx.font = '9px "DM Sans", sans-serif';
      ctx.fillText(d.label, bx + barWidth / 2, 172);
    });
  }

  // ==============================================================
  // 3. ONE-CLICK FLEET MANIFEST CSV EXPORT
  // ==============================================================
  function exportManifestCSV() {
    const raw = localStorage.getItem('vc_members_db');
    if (!raw) {
      alert('No member records available to export.');
      return;
    }
    const members = JSON.parse(raw);
    const headers = ['Roll Number', 'Full Name', 'Role', 'Rank', 'Program', 'Email', 'GPA', 'Status', 'Enrolled Courses'];
    const rows = members.map((m) => [
      `"${m.roll || ''}"`,
      `"${m.name || ''}"`,
      `"${m.role || ''}"`,
      `"${m.rank || ''}"`,
      `"${m.program || ''}"`,
      `"${m.email || ''}"`,
      `"${m.gpa || ''}"`,
      `"${m.status || 'Active'}"`,
      `"${(m.enrolledCourses || []).join('; ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadCSV(csvContent, 'vibe_college_fleet_manifest_2026.csv');
  }

  function exportEnrollmentsCSV() {
    const raw = localStorage.getItem('vc_enrollments_db');
    if (!raw) {
      alert('No enrollment records available to export.');
      return;
    }
    const enrollments = JSON.parse(raw);
    const headers = ['Decree ID', 'Cadet Roll', 'Cadet Name', 'Course Code', 'Course Title', 'Credits', 'Term', 'Request Date', 'Status', 'Decree Note'];
    const rows = enrollments.map((e) => [
      `"${e.id || ''}"`,
      `"${e.studentRoll || ''}"`,
      `"${e.studentName || ''}"`,
      `"${e.courseCode || ''}"`,
      `"${e.courseTitle || ''}"`,
      `"${e.credits || ''}"`,
      `"${e.term || ''}"`,
      `"${e.requestDate || ''}"`,
      `"${e.status || ''}"`,
      `"${e.adminDecree || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadCSV(csvContent, 'vibe_college_enrollment_decrees_2026.csv');
  }

  function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showFleetBroadcastToast(`📥 Downloaded ${filename}!`);
  }

  // Hook export buttons on admin.html
  window.addEventListener('DOMContentLoaded', () => {
    const btnExpManifest = document.querySelector('#btn-export-manifest-csv');
    if (btnExpManifest) {
      btnExpManifest.addEventListener('click', exportManifestCSV);
    }
    const btnExpEnrollments = document.querySelector('#btn-export-enrollments-csv');
    if (btnExpEnrollments) {
      btnExpEnrollments.addEventListener('click', exportEnrollmentsCSV);
    }

    renderAnalyticsCharts();
  });

  window.VibeAdminSuite = {
    broadcast: broadcastFleetEvent,
    exportManifestCSV,
    exportEnrollmentsCSV,
    renderCharts: renderAnalyticsCharts,
  };
})();

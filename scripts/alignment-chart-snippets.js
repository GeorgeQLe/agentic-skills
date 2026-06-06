/**
 * Alignment Chart Snippets — self-contained chart rendering for alignment pages.
 *
 * Usage: copy the needed functions into a <script> block in the alignment page HTML.
 * All functions read CSS variables (--chart-1 through --chart-8) for colors and
 * render into a target <canvas> or SVG container. Each chart function creates a
 * companion <table> fallback and a "View as table" toggle button.
 *
 * Supported chart types:
 *   alignChart.bar(container, data, opts)        — horizontal or vertical bar chart
 *   alignChart.line(container, data, opts)        — single or multi-series line chart
 *   alignChart.radar(container, data, opts)       — radar/spider chart (SVG)
 *   alignChart.quadrant(container, data, opts)    — 2x2 quadrant plot
 *   alignChart.funnel(container, data, opts)      — funnel chart
 *   alignChart.flow(container, data, opts)        — simplified Sankey/flow diagram (SVG)
 *   alignChart.ring(container, data, opts)        — circular/ring/donut chart
 *   alignChart.heatmap(container, data, opts)     — heatmap/matrix
 *
 * All functions are dark-mode aware and respect the alignment page color palette.
 */

const alignChart = (() => {
  const COLORS = ['--chart-1','--chart-2','--chart-3','--chart-4','--chart-5','--chart-6','--chart-7','--chart-8'];
  const FALLBACK_COLORS = ['#58a6ff','#3fb950','#d29922','#bc8cff','#f85149','#79c0ff','#f0883e','#a5d6ff'];

  function getColor(i) {
    const style = getComputedStyle(document.documentElement);
    const v = style.getPropertyValue(COLORS[i % COLORS.length]).trim();
    return v || FALLBACK_COLORS[i % FALLBACK_COLORS.length];
  }

  function getTextColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#c9d1d9';
  }

  function getMutedColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8b949e';
  }

  function getBorderColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#30363d';
  }

  function getSurfaceColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#161b22';
  }

  function createToggle(container, canvas, table) {
    const btn = document.createElement('button');
    btn.textContent = 'View as table';
    btn.style.cssText = 'margin:8px 0;padding:6px 14px;background:transparent;color:' + getColor(0) + ';border:1px solid ' + getBorderColor() + ';border-radius:4px;cursor:pointer;font-size:0.85rem;min-height:44px;';
    btn.setAttribute('aria-label', 'Toggle between chart and table view');
    let showingChart = true;
    btn.addEventListener('click', () => {
      showingChart = !showingChart;
      canvas.hidden = !showingChart;
      table.hidden = showingChart;
      btn.textContent = showingChart ? 'View as table' : 'View as chart';
    });
    container.appendChild(btn);
  }

  function makeTableWrap(headers, rows) {
    const wrap = document.createElement('div');
    wrap.style.overflowX = 'auto';
    const t = document.createElement('table');
    t.style.cssText = 'width:100%;border-collapse:collapse;';
    const thead = document.createElement('thead');
    const hr = document.createElement('tr');
    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      th.style.cssText = 'padding:8px 12px;text-align:left;border-bottom:1px solid ' + getBorderColor() + ';background:' + getSurfaceColor() + ';color:#fff;';
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    t.appendChild(thead);
    const tbody = document.createElement('tbody');
    rows.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        td.style.cssText = 'padding:6px 12px;border-bottom:1px solid ' + getBorderColor() + ';';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    t.appendChild(tbody);
    wrap.appendChild(t);
    wrap.hidden = true;
    return wrap;
  }

  function ensureCanvas(container, w, h, ariaLabel) {
    const c = document.createElement('canvas');
    c.width = w || 600;
    c.height = h || 400;
    c.style.cssText = 'max-width:100%;height:auto;';
    c.setAttribute('aria-label', ariaLabel || 'Chart');
    c.setAttribute('role', 'img');
    container.appendChild(c);
    return c;
  }

  // --- Bar Chart ---
  function bar(container, data, opts = {}) {
    const { horizontal = false, title = 'Bar Chart', width = 600, height = 400 } = opts;
    const labels = data.map(d => d.label);
    const values = data.map(d => d.value);
    const max = Math.max(...values) * 1.15;

    const ariaLabel = `${title}: bar chart with ${data.length} items. Highest: ${labels[values.indexOf(Math.max(...values))]} (${Math.max(...values)})`;
    const c = ensureCanvas(container, width, height, ariaLabel);
    const ctx = c.getContext('2d');
    const pad = { top: 40, right: 20, bottom: 60, left: horizontal ? 120 : 50 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;

    ctx.fillStyle = getTextColor();
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(title, pad.left, 24);

    if (horizontal) {
      const barH = ch / labels.length * 0.7;
      const gap = ch / labels.length * 0.3;
      labels.forEach((label, i) => {
        const y = pad.top + i * (barH + gap) + gap / 2;
        const bw = (values[i] / max) * cw;
        ctx.fillStyle = getColor(i);
        ctx.fillRect(pad.left, y, bw, barH);
        ctx.fillStyle = getMutedColor();
        ctx.font = '12px system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(label, pad.left - 8, y + barH / 2 + 4);
        ctx.textAlign = 'left';
        ctx.fillStyle = getTextColor();
        ctx.fillText(String(values[i]), pad.left + bw + 6, y + barH / 2 + 4);
      });
    } else {
      const barW = cw / labels.length * 0.6;
      const gap = cw / labels.length * 0.4;
      ctx.strokeStyle = getBorderColor();
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top);
      ctx.lineTo(pad.left, pad.top + ch);
      ctx.lineTo(pad.left + cw, pad.top + ch);
      ctx.stroke();

      labels.forEach((label, i) => {
        const x = pad.left + i * (barW + gap) + gap / 2;
        const bh = (values[i] / max) * ch;
        ctx.fillStyle = getColor(i);
        ctx.fillRect(x, pad.top + ch - bh, barW, bh);
        ctx.fillStyle = getMutedColor();
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x + barW / 2, pad.top + ch + 14);
        if (label.length > 10) ctx.rotate(-0.4);
        ctx.fillText(label, 0, 0);
        ctx.restore();
        ctx.fillStyle = getTextColor();
        ctx.font = '12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(values[i]), x + barW / 2, pad.top + ch - bh - 6);
      });
    }

    const table = makeTableWrap(['Label', 'Value'], data.map(d => [d.label, String(d.value)]));
    container.appendChild(table);
    createToggle(container, c, table);
  }

  // --- Line Chart ---
  function line(container, data, opts = {}) {
    const { title = 'Line Chart', width = 600, height = 400, xLabels = [] } = opts;
    const series = Array.isArray(data[0]?.values) ? data : [{ name: 'Series', values: data.map(d => d.value), labels: data.map(d => d.label) }];
    const allVals = series.flatMap(s => s.values);
    const max = Math.max(...allVals) * 1.15;
    const min = Math.min(0, Math.min(...allVals));
    const labels = xLabels.length ? xLabels : (series[0].labels || series[0].values.map((_, i) => String(i + 1)));

    const ariaLabel = `${title}: line chart with ${series.length} series and ${labels.length} data points`;
    const c = ensureCanvas(container, width, height, ariaLabel);
    const ctx = c.getContext('2d');
    const pad = { top: 40, right: 80, bottom: 50, left: 50 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;

    ctx.fillStyle = getTextColor();
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(title, pad.left, 24);

    ctx.strokeStyle = getBorderColor();
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + ch);
    ctx.lineTo(pad.left + cw, pad.top + ch);
    ctx.stroke();

    const labelStep = Math.max(1, Math.floor(labels.length / 10));
    labels.forEach((l, i) => {
      if (i % labelStep !== 0) return;
      const x = pad.left + (i / (labels.length - 1)) * cw;
      ctx.fillStyle = getMutedColor();
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(l, x, pad.top + ch + 18);
    });

    series.forEach((s, si) => {
      const color = getColor(si);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      s.values.forEach((v, i) => {
        const x = pad.left + (i / (s.values.length - 1 || 1)) * cw;
        const y = pad.top + ch - ((v - min) / (max - min)) * ch;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();

      s.values.forEach((v, i) => {
        const x = pad.left + (i / (s.values.length - 1 || 1)) * cw;
        const y = pad.top + ch - ((v - min) / (max - min)) * ch;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = color;
      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'left';
      const lastX = pad.left + cw;
      const lastY = pad.top + ch - ((s.values[s.values.length - 1] - min) / (max - min)) * ch;
      ctx.fillText(s.name, lastX + 6, lastY + 4);
    });

    const headers = ['Point', ...series.map(s => s.name)];
    const rows = labels.map((l, i) => [l, ...series.map(s => String(s.values[i] ?? ''))]);
    const table = makeTableWrap(headers, rows);
    container.appendChild(table);
    createToggle(container, c, table);
  }

  // --- Radar Chart (SVG) ---
  function radar(container, data, opts = {}) {
    const { title = 'Radar Chart', size = 400, maxValue } = opts;
    const axes = data.map(d => d.axis);
    const sets = Array.isArray(data[0]?.sets) ? data[0].sets : [{ name: 'Values', values: data.map(d => d.value) }];
    const max = maxValue || Math.max(...sets.flatMap(s => s.values)) * 1.15;
    const n = axes.length;
    const cx = size / 2, cy = size / 2, r = size * 0.35;

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('aria-label', `${title}: radar chart with ${n} axes and ${sets.length} data sets`);
    svg.setAttribute('role', 'img');
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';

    const titleEl = document.createElementNS(ns, 'text');
    titleEl.setAttribute('x', '12');
    titleEl.setAttribute('y', '20');
    titleEl.setAttribute('fill', getTextColor());
    titleEl.setAttribute('font-size', '14');
    titleEl.setAttribute('font-weight', 'bold');
    titleEl.setAttribute('font-family', 'system-ui, sans-serif');
    titleEl.textContent = title;
    svg.appendChild(titleEl);

    for (let ring = 1; ring <= 4; ring++) {
      const rr = (ring / 4) * r;
      let pts = [];
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        pts.push(`${cx + rr * Math.cos(angle)},${cy + rr * Math.sin(angle)}`);
      }
      const poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', pts.join(' '));
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', getBorderColor());
      poly.setAttribute('stroke-width', '1');
      svg.appendChild(poly);
    }

    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const lx = cx + r * Math.cos(angle);
      const ly = cy + r * Math.sin(angle);
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', lx);
      line.setAttribute('y2', ly);
      line.setAttribute('stroke', getBorderColor());
      svg.appendChild(line);

      const tx = cx + (r + 16) * Math.cos(angle);
      const ty = cy + (r + 16) * Math.sin(angle);
      const label = document.createElementNS(ns, 'text');
      label.setAttribute('x', tx);
      label.setAttribute('y', ty + 4);
      label.setAttribute('fill', getMutedColor());
      label.setAttribute('font-size', '11');
      label.setAttribute('font-family', 'system-ui, sans-serif');
      label.setAttribute('text-anchor', angle > Math.PI / 2 && angle < Math.PI * 1.5 ? 'end' : angle === Math.PI / 2 || angle === -Math.PI / 2 ? 'middle' : 'start');
      label.textContent = axes[i];
      svg.appendChild(label);
    }

    sets.forEach((s, si) => {
      const color = getColor(si);
      let pts = [];
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const vr = (s.values[i] / max) * r;
        pts.push(`${cx + vr * Math.cos(angle)},${cy + vr * Math.sin(angle)}`);
      }
      const poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', pts.join(' '));
      poly.setAttribute('fill', color);
      poly.setAttribute('fill-opacity', '0.15');
      poly.setAttribute('stroke', color);
      poly.setAttribute('stroke-width', '2');
      svg.appendChild(poly);

      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const vr = (s.values[i] / max) * r;
        const dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('cx', cx + vr * Math.cos(angle));
        dot.setAttribute('cy', cy + vr * Math.sin(angle));
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', color);
        svg.appendChild(dot);
      }
    });

    container.appendChild(svg);

    const headers = ['Axis', ...sets.map(s => s.name)];
    const rows = axes.map((a, i) => [a, ...sets.map(s => String(s.values[i]))]);
    const table = makeTableWrap(headers, rows);
    container.appendChild(table);
    createToggle(container, svg, table);
  }

  // --- Quadrant/2x2 Plot ---
  function quadrant(container, data, opts = {}) {
    const { title = 'Quadrant Chart', width = 500, height = 500, xAxis = 'X', yAxis = 'Y', quadrantLabels = [] } = opts;
    const ariaLabel = `${title}: quadrant plot with ${data.length} items on ${xAxis} vs ${yAxis}`;
    const c = ensureCanvas(container, width, height, ariaLabel);
    const ctx = c.getContext('2d');
    const pad = { top: 40, right: 30, bottom: 40, left: 50 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;
    const midX = pad.left + cw / 2;
    const midY = pad.top + ch / 2;

    ctx.fillStyle = getTextColor();
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(title, pad.left, 24);

    ctx.strokeStyle = getBorderColor();
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX, pad.top);
    ctx.lineTo(midX, pad.top + ch);
    ctx.moveTo(pad.left, midY);
    ctx.lineTo(pad.left + cw, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (quadrantLabels.length === 4) {
      ctx.fillStyle = getMutedColor();
      ctx.font = '11px system-ui, sans-serif';
      ctx.globalAlpha = 0.5;
      ctx.textAlign = 'center';
      ctx.fillText(quadrantLabels[0], pad.left + cw * 0.25, pad.top + 16);
      ctx.fillText(quadrantLabels[1], pad.left + cw * 0.75, pad.top + 16);
      ctx.fillText(quadrantLabels[2], pad.left + cw * 0.25, pad.top + ch - 6);
      ctx.fillText(quadrantLabels[3], pad.left + cw * 0.75, pad.top + ch - 6);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = getMutedColor();
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(xAxis, midX, pad.top + ch + 30);
    ctx.save();
    ctx.translate(16, midY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yAxis, 0, 0);
    ctx.restore();

    data.forEach((d, i) => {
      const x = pad.left + (d.x / 100) * cw;
      const y = pad.top + ch - (d.y / 100) * ch;
      ctx.fillStyle = getColor(i);
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = getTextColor();
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(d.label, x + 12, y + 4);
    });

    const table = makeTableWrap(['Item', xAxis, yAxis], data.map(d => [d.label, String(d.x), String(d.y)]));
    container.appendChild(table);
    createToggle(container, c, table);
  }

  // --- Funnel Chart ---
  function funnel(container, data, opts = {}) {
    const { title = 'Funnel', width = 500, height = 400 } = opts;
    const max = data[0]?.value || 1;
    const ariaLabel = `${title}: funnel chart with ${data.length} stages from ${data[0]?.label} (${data[0]?.value}) to ${data[data.length - 1]?.label} (${data[data.length - 1]?.value})`;
    const c = ensureCanvas(container, width, height, ariaLabel);
    const ctx = c.getContext('2d');
    const pad = { top: 40, bottom: 20 };
    const ch = height - pad.top - pad.bottom;
    const stepH = ch / data.length;
    const centerX = width / 2;

    ctx.fillStyle = getTextColor();
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, centerX, 24);

    data.forEach((d, i) => {
      const w = (d.value / max) * (width * 0.8);
      const nextW = i < data.length - 1 ? (data[i + 1].value / max) * (width * 0.8) : w * 0.8;
      const y = pad.top + i * stepH;
      ctx.fillStyle = getColor(i);
      ctx.beginPath();
      ctx.moveTo(centerX - w / 2, y);
      ctx.lineTo(centerX + w / 2, y);
      ctx.lineTo(centerX + nextW / 2, y + stepH);
      ctx.lineTo(centerX - nextW / 2, y + stepH);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.label}: ${d.value}`, centerX, y + stepH / 2 + 5);

      if (i > 0) {
        const pct = ((d.value / data[i - 1].value) * 100).toFixed(0);
        ctx.fillStyle = getMutedColor();
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${pct}%`, centerX + w / 2 + 8, y + 12);
      }
    });

    const rows = data.map((d, i) => [d.label, String(d.value), i > 0 ? ((d.value / data[i - 1].value) * 100).toFixed(1) + '%' : '100%']);
    const table = makeTableWrap(['Stage', 'Count', 'Conversion'], rows);
    container.appendChild(table);
    createToggle(container, c, table);
  }

  // --- Flow / Sankey Diagram (SVG) ---
  function flow(container, data, opts = {}) {
    const { title = 'Flow Diagram', width = 700, height = 400 } = opts;
    const { nodes, links } = data;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('aria-label', `${title}: flow diagram with ${nodes.length} nodes and ${links.length} connections`);
    svg.setAttribute('role', 'img');
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';

    const titleEl = document.createElementNS(ns, 'text');
    titleEl.setAttribute('x', '12');
    titleEl.setAttribute('y', '24');
    titleEl.setAttribute('fill', getTextColor());
    titleEl.setAttribute('font-size', '14');
    titleEl.setAttribute('font-weight', 'bold');
    titleEl.setAttribute('font-family', 'system-ui, sans-serif');
    titleEl.textContent = title;
    svg.appendChild(titleEl);

    const nodeWidth = 24;
    const pad = { top: 40, bottom: 20, left: 30, right: 30 };
    const layers = {};
    nodes.forEach(n => { layers[n.layer] = layers[n.layer] || []; layers[n.layer].push(n); });
    const layerKeys = Object.keys(layers).sort((a, b) => a - b);
    const layerSpacing = (width - pad.left - pad.right - nodeWidth) / (layerKeys.length - 1 || 1);

    const nodePositions = {};
    layerKeys.forEach((lk, li) => {
      const layerNodes = layers[lk];
      const totalH = height - pad.top - pad.bottom;
      const nodeH = totalH / (layerNodes.length + 1);
      layerNodes.forEach((n, ni) => {
        nodePositions[n.id] = {
          x: pad.left + li * layerSpacing,
          y: pad.top + (ni + 1) * nodeH - nodeH / 2,
          h: Math.max(20, nodeH * 0.6),
        };
      });
    });

    links.forEach((link, i) => {
      const src = nodePositions[link.source];
      const tgt = nodePositions[link.target];
      if (!src || !tgt) return;
      const path = document.createElementNS(ns, 'path');
      const sx = src.x + nodeWidth;
      const sy = src.y;
      const tx = tgt.x;
      const ty = tgt.y;
      const mx = (sx + tx) / 2;
      path.setAttribute('d', `M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', getColor(i % 8));
      path.setAttribute('stroke-opacity', '0.4');
      path.setAttribute('stroke-width', Math.max(2, Math.min(20, link.value || 4)));
      svg.appendChild(path);
    });

    nodes.forEach((n, i) => {
      const pos = nodePositions[n.id];
      if (!pos) return;
      const rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', pos.x);
      rect.setAttribute('y', pos.y - pos.h / 2);
      rect.setAttribute('width', nodeWidth);
      rect.setAttribute('height', pos.h);
      rect.setAttribute('fill', getColor(i % 8));
      rect.setAttribute('rx', '3');
      svg.appendChild(rect);

      const label = document.createElementNS(ns, 'text');
      label.setAttribute('x', pos.x + nodeWidth + 6);
      label.setAttribute('y', pos.y + 4);
      label.setAttribute('fill', getTextColor());
      label.setAttribute('font-size', '11');
      label.setAttribute('font-family', 'system-ui, sans-serif');
      label.textContent = n.name + (n.value != null ? ` (${n.value})` : '');
      svg.appendChild(label);
    });

    container.appendChild(svg);

    const headers = ['Source', 'Target', 'Value'];
    const rows = links.map(l => [
      nodes.find(n => n.id === l.source)?.name || l.source,
      nodes.find(n => n.id === l.target)?.name || l.target,
      String(l.value ?? ''),
    ]);
    const table = makeTableWrap(headers, rows);
    container.appendChild(table);
    createToggle(container, svg, table);
  }

  // --- Ring / Donut Chart ---
  function ring(container, data, opts = {}) {
    const { title = 'Ring Chart', size = 400 } = opts;
    const total = data.reduce((s, d) => s + d.value, 0);
    const ariaLabel = `${title}: ring chart with ${data.length} segments totaling ${total}`;
    const c = ensureCanvas(container, size, size, ariaLabel);
    const ctx = c.getContext('2d');
    const cx = size / 2, cy = size / 2;
    const outerR = size * 0.38;
    const innerR = size * 0.22;

    ctx.fillStyle = getTextColor();
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, cx, 24);

    let startAngle = -Math.PI / 2;
    data.forEach((d, i) => {
      const sweep = (d.value / total) * Math.PI * 2;
      ctx.fillStyle = getColor(i);
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep);
      ctx.arc(cx, cy, innerR, startAngle + sweep, startAngle, true);
      ctx.closePath();
      ctx.fill();

      if (sweep > 0.3) {
        const mid = startAngle + sweep / 2;
        const lx = cx + (outerR + 20) * Math.cos(mid);
        const ly = cy + (outerR + 20) * Math.sin(mid);
        ctx.fillStyle = getTextColor();
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = mid > Math.PI / 2 && mid < Math.PI * 1.5 ? 'right' : 'left';
        ctx.fillText(`${d.label} (${((d.value / total) * 100).toFixed(0)}%)`, lx, ly + 4);
      }
      startAngle += sweep;
    });

    ctx.fillStyle = getTextColor();
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(total), cx, cy + 6);

    const rows = data.map(d => [d.label, String(d.value), ((d.value / total) * 100).toFixed(1) + '%']);
    const table = makeTableWrap(['Segment', 'Value', 'Percentage'], rows);
    container.appendChild(table);
    createToggle(container, c, table);
  }

  // --- Heatmap / Matrix ---
  function heatmap(container, data, opts = {}) {
    const { title = 'Heatmap', width = 600, height = 400, xLabels = [], yLabels = [] } = opts;
    const { matrix } = data;
    const flat = matrix.flat();
    const min = Math.min(...flat);
    const max = Math.max(...flat);
    const range = max - min || 1;

    const ariaLabel = `${title}: heatmap with ${yLabels.length} rows and ${xLabels.length} columns, values from ${min} to ${max}`;
    const c = ensureCanvas(container, width, height, ariaLabel);
    const ctx = c.getContext('2d');
    const pad = { top: 40, right: 20, bottom: 60, left: 80 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;
    const cellW = cw / xLabels.length;
    const cellH = ch / yLabels.length;

    ctx.fillStyle = getTextColor();
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(title, pad.left, 24);

    const lowColor = [22, 27, 34];
    const highColor = [88, 166, 255];

    matrix.forEach((row, ri) => {
      row.forEach((val, ci) => {
        const t = (val - min) / range;
        const r = Math.round(lowColor[0] + (highColor[0] - lowColor[0]) * t);
        const g = Math.round(lowColor[1] + (highColor[1] - lowColor[1]) * t);
        const b = Math.round(lowColor[2] + (highColor[2] - lowColor[2]) * t);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(pad.left + ci * cellW, pad.top + ri * cellH, cellW - 1, cellH - 1);

        ctx.fillStyle = t > 0.5 ? '#0d1117' : '#c9d1d9';
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(val), pad.left + ci * cellW + cellW / 2, pad.top + ri * cellH + cellH / 2 + 4);
      });
    });

    ctx.fillStyle = getMutedColor();
    ctx.font = '11px system-ui, sans-serif';
    xLabels.forEach((l, i) => {
      ctx.save();
      ctx.translate(pad.left + i * cellW + cellW / 2, pad.top + ch + 14);
      if (l.length > 8) ctx.rotate(-0.4);
      ctx.textAlign = 'center';
      ctx.fillText(l, 0, 0);
      ctx.restore();
    });
    yLabels.forEach((l, i) => {
      ctx.textAlign = 'right';
      ctx.fillText(l, pad.left - 8, pad.top + i * cellH + cellH / 2 + 4);
    });

    const headers = ['', ...xLabels];
    const rows = yLabels.map((yl, ri) => [yl, ...matrix[ri].map(String)]);
    const table = makeTableWrap(headers, rows);
    container.appendChild(table);
    createToggle(container, c, table);
  }

  return { bar, line, radar, quadrant, funnel, flow, ring, heatmap };
})();

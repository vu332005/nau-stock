// Format Percentages
export function formatPercent(value, showPlus = false) {
  if (value === null || value === undefined || isNaN(value)) return "N/A";
  const num = value * 100;
  const prefix = showPlus && num > 0 ? "+" : "";
  return `${prefix}${num.toFixed(2)}%`;
}

// Calculate Rankings for 3M
export function getRank3m(tickers, symbol) {
  const sorted = [...tickers].sort((a, b) => {
    const valA = a.return_3m !== null ? a.return_3m : -Infinity;
    const valB = b.return_3m !== null ? b.return_3m : -Infinity;
    return valB - valA;
  });
  return sorted.findIndex(t => t.ticker === symbol) + 1;
}

// Calculate Rankings for 6M
export function getRank6m(tickers, symbol) {
  const sorted = [...tickers].sort((a, b) => {
    const valA = a.return_6m !== null ? a.return_6m : -Infinity;
    const valB = b.return_6m !== null ? b.return_6m : -Infinity;
    return valB - valA;
  });
  return sorted.findIndex(t => t.ticker === symbol) + 1;
}

// Determine Trend details
export function getTrendDetails(item) {
  const r3m = item.return_3m;
  const r6m = item.return_6m;
  
  if (r6m > 0 && r3m > 0) {
    return {
      badgeClass: "badge-up",
      badgeText: "Tăng mạnh",
      modalBadgeClass: "badge-up",
      modalBadgeText: "Tăng đồng thuận",
      correlationType: "Đồng thuận Tăng",
      analysisText: `Cổ phiếu ${item.ticker} đang thể hiện một đà tăng trưởng đồng bộ rất mạnh mẽ trong cả trung hạn (6 tháng) và ngắn hạn (3 tháng). Thích hợp cho chiến lược nắm giữ xu hướng tiếp diễn.`
    };
  } else if (r6m < 0 && r3m < 0) {
    return {
      badgeClass: "badge-down",
      badgeText: "Suy yếu",
      modalBadgeClass: "badge-down",
      modalBadgeText: "Giảm đồng thuận",
      correlationType: "Đồng thuận Giảm",
      analysisText: `Cổ phiếu ${item.ticker} đang chịu áp lực bán tháo bền bỉ. Việc cả hiệu suất 3 tháng và 6 tháng đều âm chứng tỏ dòng tiền lớn vẫn đang rời khỏi mã này. Nhà đầu tư nên cực kỳ thận trọng và tránh bắt đáy quá sớm.`
    };
  } else if (r6m > 0 && r3m < 0) {
    return {
      badgeClass: "badge-flat",
      badgeText: "Điều chỉnh tăng",
      modalBadgeClass: "badge-flat",
      modalBadgeText: "Điều chỉnh kỹ thuật",
      correlationType: "Tăng dài hạn - Giảm ngắn hạn",
      analysisText: `Cổ phiếu ${item.ticker} về mặt dài hạn vẫn là một cổ phiếu tăng trưởng tích cực (+${(r6m*100).toFixed(1)}%), tuy nhiên ngắn hạn 3 tháng qua đang chịu đợt chốt lời/điều chỉnh kỹ thuật (${(r3m*100).toFixed(1)}%). Đây có thể là vùng tích lũy tiềm năng nếu các chỉ số hỗ trợ giữ vững.`
    };
  } else {
    return {
      badgeClass: "badge-flat",
      badgeText: "Hồi phục ngắn",
      modalBadgeClass: "badge-flat",
      modalBadgeText: "Hồi phục kỹ thuật",
      correlationType: "Giảm dài hạn - Tăng ngắn hạn",
      analysisText: `Cổ phiếu ${item.ticker} ghi nhận dấu hiệu dòng tiền quay trở lại trong ngắn hạn (+${(r3m*100).toFixed(1)}% trong 3 tháng qua) sau khi chịu đợt sụt giảm dài hạn. Đây có thể là nhịp hồi phục kỹ thuật trong một xu thế giảm lớn. Cần quan sát thêm lực cầu tại các mốc kháng cự phía trên.`
    };
  }
}

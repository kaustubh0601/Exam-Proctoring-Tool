import { useEffect, useState, useRef } from 'react';

const useProctoring = (onTerminate, setTabSwitchCount, setBlurCount) => {
  const [warnings, setWarnings] = useState([]);
  const SwitchBurlCount = useRef(0);
  const [lastViolationType, setLastViolationType] = useState(null);


  useEffect(() => {
    const handleTabSwitch = () => {
      SwitchBurlCount.current += 1;
      setLastViolationType('Tab switch');
      if (setTabSwitchCount) setTabSwitchCount(SwitchBurlCount.current);

      setWarnings((prev) => [
        ...prev,
        `❓ Warning: Tab Switching (${SwitchBurlCount.current}/5) and Window Blur/Focus are monitored. Please stay on the exam page. `
      ]);
      if (SwitchBurlCount.current >= 5) {
        setWarnings((prev) => [...prev, 'You have switched tabs too many times. The exam will be terminated.']);
        if (onTerminate) onTerminate();
      }
    };

    const handleBlur = () => {
      SwitchBurlCount.current += 1;
      setLastViolationType('Window blur');
      if (setBlurCount) setBlurCount(SwitchBurlCount.current);

      setWarnings((prev) => [
        ...prev,
        `❌ Warning: Window Blur/Focus are monitored (${SwitchBurlCount.current}/5). Please stay on the exam page.`
      ]);
      if (SwitchBurlCount.current >= 5) {
        setWarnings((prev) => [...prev, 'You have switched window focus too many times. The exam will be terminated.']);
        if (onTerminate) onTerminate();
      }
    };

    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && ['c', 'v', 'u', 'a', 'x'].includes(e.key.toLowerCase())) ||
        (e.metaKey && ['c', 'v', 'u', 'a', 'x'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i')      // preventing F12 and Ctrl+Shift+I
      ) {
        e.preventDefault();
        setWarnings((prev) => [...prev, 'Blocked forbidden shortcut!']);
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      setWarnings((prev) => [...prev, 'Right-click is disabled during the exam.']);
    };

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') {
        handleTabSwitch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);

    return () => {                                                                  // clean up function to remove event listeners
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [onTerminate, setTabSwitchCount, setBlurCount]);

  return { warnings, lastViolationType, SwitchBurlCount: SwitchBurlCount.current };
};

export default useProctoring; 
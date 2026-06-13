function isDisabledPressTarget(element: HTMLElement): boolean {
  return element instanceof HTMLButtonElement && element.disabled;
}

function isPointerOverElement(element: HTMLElement, event: PointerEvent): boolean {
  const rect = element.getBoundingClientRect();
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}

/**
 * Binds a press handler that allows any drag distance while the pointer stays on the element.
 * Uses pointer capture so release is always observed, then checks the release point is still inside.
 */
export function bindUiPress(element: HTMLElement, onPress: () => void): () => void {
  let activePointerId: number | null = null;

  const clearPress = (): void => {
    activePointerId = null;
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || isDisabledPressTarget(element)) {
      return;
    }
    activePointerId = event.pointerId;
    element.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: PointerEvent): void => {
    if (event.button !== 0 || activePointerId !== event.pointerId) {
      return;
    }
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
    clearPress();

    if (isDisabledPressTarget(element) || !isPointerOverElement(element, event)) {
      return;
    }

    event.preventDefault();
    onPress();
  };

  const onPointerCancel = (event: PointerEvent): void => {
    if (activePointerId !== event.pointerId) {
      return;
    }
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
    clearPress();
  };

  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointerup', onPointerUp);
  element.addEventListener('pointercancel', onPointerCancel);

  return () => {
    element.removeEventListener('pointerdown', onPointerDown);
    element.removeEventListener('pointerup', onPointerUp);
    element.removeEventListener('pointercancel', onPointerCancel);
  };
}

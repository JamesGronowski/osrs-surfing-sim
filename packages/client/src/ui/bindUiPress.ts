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

/**
 * Delegated press binding for lists that re-render. Captures on the stable root so a
 * child replacement between pointerdown and pointerup does not drop the click.
 */
export function bindDelegatedUiPress(
  root: HTMLElement,
  selector: string,
  onPress: (target: HTMLElement) => void,
): () => void {
  let activePointerId: number | null = null;
  let activePressKey: string | null = null;

  const clearPress = (): void => {
    activePointerId = null;
    activePressKey = null;
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) {
      return;
    }
    const target = (event.target as HTMLElement).closest(selector);
    if (!(target instanceof HTMLElement) || isDisabledPressTarget(target)) {
      return;
    }
    const pressKey = target.getAttribute('data-unlock');
    if (!pressKey) {
      return;
    }
    activePointerId = event.pointerId;
    activePressKey = pressKey;
    root.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: PointerEvent): void => {
    if (event.button !== 0 || activePointerId !== event.pointerId || activePressKey === null) {
      return;
    }
    if (root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }

    const pressKey = activePressKey;
    clearPress();

    const currentTarget = root.querySelector(`[data-unlock="${pressKey}"]`);
    if (!(currentTarget instanceof HTMLElement)) {
      return;
    }
    if (isDisabledPressTarget(currentTarget) || !isPointerOverElement(currentTarget, event)) {
      return;
    }

    event.preventDefault();
    onPress(currentTarget);
  };

  const onPointerCancel = (event: PointerEvent): void => {
    if (activePointerId !== event.pointerId) {
      return;
    }
    if (root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }
    clearPress();
  };

  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerCancel);

  return () => {
    root.removeEventListener('pointerdown', onPointerDown);
    root.removeEventListener('pointerup', onPointerUp);
    root.removeEventListener('pointercancel', onPointerCancel);
  };
}

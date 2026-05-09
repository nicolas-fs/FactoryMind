# Simulación de acciones – En producción se conectarán a APIs reales del cliente.

ACTIONS = {
    "check_stock": lambda product="X": f"Stock del producto {product}: 145 unidades disponibles.",
    "get_order_status": lambda order="0001": f"El pedido {order} se encuentra EN_TRÁNSITO.",
}

def execute_action(action_name: str, params: dict = None) -> str:
    """Ejecuta la acción indicada y devuelve el resultado."""
    action = ACTIONS.get(action_name)
    if action:
        try:
            return action(**(params or {}))
        except Exception as e:
            return f"Error al ejecutar {action_name}: {e}"
    return f"Acción '{action_name}' no disponible."
"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/CartContext";

const DELIVERY_FEE = 5;
const FREE_DELIVERY_THRESHOLD = 50;

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        showCloseButton
        className="w-full sm:max-w-[420px] bg-[#FAFAF7] flex flex-col p-0 gap-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-[#2D5016]/10">
          <SheetTitle className="font-heading text-xl font-bold text-[#2D5016] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
            {totalItems > 0 && (
              <span className="ml-auto text-[12px] font-medium text-[#6B5B4B] font-body">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                onDecrease={() =>
                  item.quantity > 1
                    ? updateQuantity(item.id, item.quantity - 1)
                    : removeItem(item.id)
                }
                onRemove={() => removeItem(item.id)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#2D5016]/10 px-6 py-5 space-y-4 bg-white">
            {/* Delivery bar */}
            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <div className="bg-[#E8A838]/10 rounded-xl px-4 py-3">
                <p className="text-[12px] text-[#6B5B4B]">
                  Add{" "}
                  <strong className="text-[#2D5016]">
                    ${(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)}
                  </strong>{" "}
                  more for <strong className="text-[#2D5016]">free delivery</strong> 🚐
                </p>
                <div className="mt-2 h-1.5 bg-[#E8A838]/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E8A838] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between text-[#6B5B4B]">
                <span>Subtotal</span>
                <span className="font-medium text-[#2D5016]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#6B5B4B]">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? "text-[#2D5016] font-semibold" : "font-medium text-[#2D5016]"}>
                  {deliveryFee === 0 ? "🎉 Free" : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-[16px] font-bold text-[#2D5016] pt-2 border-t border-[#2D5016]/10">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full bg-[#2D5016] hover:bg-[#3D6B1F] text-white rounded-full h-12 font-semibold text-[14px] transition-colors shadow-lg shadow-[#2D5016]/20"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              onClick={closeCart}
              className="flex items-center justify-center w-full text-[13px] text-[#6B5B4B] hover:text-[#2D5016] transition-colors py-1"
            >
              Continue shopping
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ── Cart item row ── */
function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: import("@/lib/cart/types").CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4 items-start bg-white rounded-2xl p-4 shadow-sm">
      {/* emoji */}
      <div className="w-14 h-14 rounded-xl bg-[#2D5016]/6 flex items-center justify-center text-3xl flex-shrink-0">
        {item.image_emoji}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold tracking-wider uppercase text-[#A89880] truncate">
          {item.farmer_name}
        </p>
        <h4 className="font-heading text-[15px] font-semibold text-[#2D5016] leading-snug truncate">
          {item.name}
        </h4>
        <p className="text-[12px] text-[#6B5B4B] mt-0.5">
          ${item.price.toFixed(2)} {item.unit}
        </p>

        {/* quantity + remove */}
        <div className="flex items-center justify-between mt-3">
          {/* quantity control */}
          <div className="flex items-center gap-2 bg-[#2D5016]/6 rounded-full px-1 py-1">
            <button
              onClick={onDecrease}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#2D5016] hover:bg-[#2D5016]/10 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[14px] font-semibold text-[#2D5016] min-w-[20px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={onIncrease}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#2D5016] hover:bg-[#2D5016]/10 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* line total + remove */}
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-[#2D5016]">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={onRemove}
              className="text-[#A89880] hover:text-[#C4602A] transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Empty state ── */
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
      <span className="text-6xl mb-4">🛒</span>
      <h3 className="font-heading text-xl font-semibold text-[#2D5016] mb-2">
        Your cart is empty
      </h3>
      <p className="text-[13px] text-[#6B5B4B] max-w-[200px]">
        Add some fresh products from Baja to get started.
      </p>
    </div>
  );
}

import React from 'react'
import { useCart } from '../context/CartContext';

const ProductItem = ({p}) => {
     const truncate = (text = "", n = 90) =>
    text.length > n ? text.slice(0, n).trimEnd() + "…" : text;
    const {addToCart} = useCart()
  return (
   <article key={p.id} className="card bg-base-200 shadow-md rounded-lg overflow-hidden ">
          <figure className="h-44 w-full bg-base-200">
  <img
    src=
         {p.imageUrl ?? "https://media.istockphoto.com/id/1493470993/photo/pills-on-a-white-background.jpg?s=612x612&w=0&k=20&c=PRZ_oI3TrNA-Y29exh8SBQLTfP1_nlNwDJR90LvPoAs=" }
    
    alt={p.name}
    className="w-full h-full object-fill"
  />
</figure>


            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <h3 className="card-title text-accent text-lg">{p.name}</h3>
                <div className="badge badge-outline">#{p.id}</div>
              </div>

              <p className="text-sm text-muted mt-1 mb-3">{truncate(p.description, 110)}</p>

              <div className="mt-auto flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">₹{Number(p.price).toLocaleString()}</div>
                  <div className="text-xs text-muted">inclusive of taxes</div>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => addToCart(p.id, 1)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </article>
  )
}

export default ProductItem

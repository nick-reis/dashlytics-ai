"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { orderColumns } from "@/components/data-table/columns/order-columns";
import { DashboardHeader } from "@/components/dashboard-header";
import { EditOrderDialog } from "@/components/edit-order/edit-order-dialog";
import { Order } from "@/types";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import LoadIcon from "@/components/ui/load-icon";
import { Plus, RefreshCcw, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Orders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    orders,
    initialLoading,
    loading,
    removeOrders,
    editOrder,
    refetch,
    createOrder,
  } = useOrders();

  const [activeAddRow, setActiveAddRow] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const editId = searchParams.get("edit");

  const columns = orderColumns({
    onDeleteRowClick: (order) => {
      setSelectedOrders((prev) => Array.from(new Set([...prev, order.id])));
      setDeleteDialogOpen(true);
    },
  });

  const openEditDialog = (id: string) => router.push(`/orders?edit=${id}`);
  const closeEditDialog = () => router.push("/orders");

  useEffect(() => {
    // console.log(selectedOrders);
  }, [selectedOrders]);

  const selectedLabel =
    selectedOrders.length === 1
      ? (() => {
          const o = orders.find((x) => x.id === selectedOrders[0]);
          return `order ${o?.id.slice(0, 8) ?? ""}`.trim();
        })()
      : `${selectedOrders.length} orders`;

  return (
    <div className="w-full h-full">
      <DashboardHeader
        title="Orders"
        actions={
          <div className="w-full flex flex-row gap-2 justify-end">
            {selectedOrders.length > 0 && deleteDialogOpen === false && (
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                variant={"secondary"}
              >
                <Trash />
                Delete {selectedOrders.length} order(s)
              </Button>
            )}
            <Button onClick={() => setActiveAddRow(true)} variant={"outline"}>
              <Plus />
              Add Order
            </Button>
            <Button
              disabled={loading || initialLoading}
              onClick={refetch}
              variant={"outline"}
            >
              {loading || initialLoading ? (
                <RefreshCcw className="animate-spin" />
              ) : (
                <RefreshCcw />
              )}
              Refresh
            </Button>
          </div>
        }
      />

      <div className="flex flex-1">
        <div className="w-full h-screen overflow-y-auto">
          <DataTable
            data={orders}
            selectedIds={selectedOrders}
            onSelectionChange={setSelectedOrders}
            loading={initialLoading}
            columns={columns}
            onClickRow={(row: Order) => openEditDialog(row.id)}
          />
        </div>
      </div>

      {editId && !initialLoading && (
        <EditOrderDialog
          order={orders.find((o) => o.id === editId)!}
          onEdit={editOrder}
          close={closeEditDialog}
        />
      )}

      {activeAddRow && (
        <EditOrderDialog
          onAdd={createOrder}
          close={() => setActiveAddRow(false)}
        />
      )}

      {deleteDialogOpen && (
        <Dialog
          open
          onOpenChange={() => {
            setSelectedOrders([]);
            setDeleteDialogOpen(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete <strong>{selectedLabel}</strong>?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex gap-2">
              <Button
                onClick={() => {
                  setSelectedOrders([]);
                  setDeleteDialogOpen(false);
                }}
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                disabled={loading}
                onClick={async () => {
                  await removeOrders(selectedOrders);
                  if (!loading) {
                    setSelectedOrders([]);
                    setDeleteDialogOpen(false);
                  }
                }}
              >
                {loading ? <LoadIcon /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

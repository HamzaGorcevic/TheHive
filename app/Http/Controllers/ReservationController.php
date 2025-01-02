<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\BeekeeperService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use function PHPUnit\Framework\isEmpty;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'beekeeper_service_id' => 'required|exists:beekeeper_services,id',
            'reservation_date' => 'required|date',
        ]);
        $existingReservation = Reservation::where('beekeeper_service_id', $data['beekeeper_service_id'])
            ->where('reservation_date', $data['reservation_date'])
            ->exists();

        if ($existingReservation) {
            return response()->json([
                'message' => 'This service is already reserved for the selected date and time.',
            ], 409);
        }

        $reservation = Reservation::create([
            'user_id' => Auth::id(),
            'beekeeper_service_id' => $data['beekeeper_service_id'],
            'reservation_date' => $data['reservation_date'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Reservation created successfully!',
            'reservation' => $reservation,
        ], 201);
    }
    public function get_reserved(Request $request)
    {
        $reservations = Reservation::with('user', 'beekeeperService.categoryservice')->where("user_id", $request->user()->id)->get();

        if ($reservations->isEmpty()) {
            return response()->json(['message' => "No reservation found"]);
        }
        return response()->json(['reservations' => $reservations]);
    }
    public function beekeeper_reservations(Request $request)
    {
        $beekeeper_id = $request->user()->id;

        $reservations = Reservation::whereHas('beekeeperService', function ($query) use ($beekeeper_id) {
            $query->where('user_id', $beekeeper_id);
        })->with(['user', 'beekeeperService.categoryservice'])
            ->get();

        return response()->json(['reservations' => $reservations], 200);
    }
    public function index()
    {
        $reservations = Reservation::where('user_id', Auth::id())
            ->with('beekeeperService')
            ->get();

        return response()->json(['reservations' => $reservations], 200);
    }

    // Fetch details of a specific reservation
    public function show($id)
    {
        $reservation = Reservation::with('beekeeperService')
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json(['reservation' => $reservation], 200);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'reservation_date' => 'sometimes|date',
        ]);
        $data['status'] = 'pending';
        $reservation = Reservation::where('user_id', Auth::id())
            ->findOrFail($id);

        $reservation->update($data);

        return response()->json([
            'message' => 'Reservation updated successfully!',
            'reservation' => $reservation,
        ], 200);
    }
    public function accept_reservation($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->status = 'confirmed';
        $reservation->save();

        return response()->json(['message' => 'Reservation accepted!'], 200);
    }

    public function decline_reservation($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();
        return response()->json(['message' => 'Reservation declined!'], 200);
    }
    // Delete a reservation
    public function destroy($id)
    {
        $reservation = Reservation::where('user_id', Auth::id())
            ->findOrFail($id);

        $reservation->delete();

        return response()->json([
            'message' => 'Reservation deleted successfully!',
        ], 200);
    }
}

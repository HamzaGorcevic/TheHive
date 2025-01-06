<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recension;
use App\Models\BeekeeperService;
use Illuminate\Support\Facades\Auth;

class RecensionController extends Controller
{
    // Get all recensions for a specific service
    public function get_service_recensions(Request $request, $serviceId)
    {
        $recensions = Recension::where('service_id', $serviceId)->with('user')->get();
        return response()->json($recensions);
    }

    // Delete a recension
    public function delete_recension(Request $request, $recensionId)
    {
        $recension = Recension::findOrFail($recensionId);

        if ($recension->user_id !== Auth::id() && $request->user()->role != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $recension->delete();
        return response()->json(['message' => 'Recension deleted successfully']);
    }

    // Create a recension for a service
    public function create_recension(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500',
            'stars' => 'required|integer|min:1|max:5',
            'service_id' => 'required|exists:beekeeper_services,id',
        ]);

        $recension = Recension::create([
            'message' => $request->message,
            'stars' => $request->stars,
            'service_id' => $request->service_id,
            'user_id' => Auth::id(), // Automatically assign the logged-in user's ID
        ]);

        return response()->json([
            'message' => 'Recension created successfully!',
            'recension' => $recension,
        ], 201);
    }
}

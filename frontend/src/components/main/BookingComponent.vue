<template>
  <div class="container-fluid">

    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid">
        <!-- Logo and Search Bar -->
        <a class="navbar-brand" href="#">
          <img src="@/assets/pantukan-waterworld-logo.jpg" width="45" height="45" class="d-inline-block align-top"
            alt="Pantukan Waterworld Logo">
          Pantukan Waterworld Beach Resort
        </a>

        <!-- Navigation Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">

          </ul>
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <img src="@/assets/user-avatar.png" class="rounded-circle" alt="User Avatar" height="32" width="32">
                {{ userdata.fName }} {{ userdata.lName }}
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#" @click=logout()>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="booking-tab" data-bs-toggle="tab" data-bs-target="#booking" type="button"
          role="tab" aria-controls="booking" aria-selected="true" @click="resetSummary(0)">Booking & Reservation</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="others-tab" data-bs-toggle="tab" data-bs-target="#others" type="button" role="tab"
          aria-controls="others" aria-selected="false" @click="resetSummary(1)">Account</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="reports-tab" data-bs-toggle="tab" data-bs-target="#reports" type="button" role="tab"
          aria-controls="reports" aria-selected="false" @click="resetSummary(2)">Reports</button>
      </li>
    </ul>
    <div class="tab-content mt-3" id="myTabContent">
      <div class="tab-pane fade show active" id="booking" role="tabpanel" aria-labelledby="booking-tab">
        <div class="container-fluid">
          <div class="row">

            <div class="col-md-12">
              <h2>Calendar <a href="#" class="btn btn-link text-decoration-none" @click="toggleSettingsModal()"><i
                    class="bi bi-gear" style="font-size: 1.25em;"></i></a></h2>


              <div class="calendar-parent">
                <calendar-view :items="calendarItems" :show-date="showDate"
                  :time-format-options="{ hour: 'numeric', minute: '2-digit' }" :enable-drag-drop="true"
                  :disable-past="disablePast" :disable-future="disableFuture" :show-times="showTimes"
                  :date-classes="myDateClasses" :display-period-uom="displayPeriodUom"
                  :display-period-count="displayPeriodCount" :starting-day-of-week="startingDayOfWeek"
                  :class="themeClasses" :period-changed-callback="periodChanged"
                  :current-period-label="useTodayIcons ? 'icons' : ''" :displayWeekNumbers="displayWeekNumbers"
                  :enable-date-selection="true" :selection-start="selectionStart" :selection-end="selectionEnd"
                  @date-selection-start="setSelection" @date-selection="setSelection"
                  @date-selection-finish="finishSelection" @drop-on-date="onDrop" @click-date="onClickDay"
                  @click-item="onClickItem">
                  <template #header="{ headerProps }">
                    <calendar-view-header slot="header" :header-props="headerProps" @input="setShowDate" />
                  </template>
                </calendar-view>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="tab-pane fade" id="others" role="tabpanel" aria-labelledby="others-tab">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-3">
              <h2>Add-ons</h2>
              <input type="text" class="form-control mb-3" placeholder="Search item" v-model="searchText3">
              <div class="wrapper-content" style="max-height:570px;height: 570px;">
                <table class="table">
                  <thead>
                    <tr>
                      <th style="white-space: nowrap;">Item</th>
                      <th>Qty</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in filteredItems" :key="index">
                      <td>{{ item.item }} ({{ item.priceRate }}/{{ item.counter }})</td>
                      <td>
                        <input style="width:75px!important" class="form-control input-sm" type="number"
                          v-model.number="howMany[index]">
                      </td>
                      <td>
                        <button class="btn btn-success" @click="addToCart(item, index)" :disabled="!item.isAvailable">
                          <i class="bi bi-cart-plus"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="col-md-3">

              <div class="d-flex align-items-center">
                <h2 class="position-relative">
                  <i class="bi bi-cart-fill me-2"></i>Inclusion
                </h2>
                <button type="button" class="btn btn-danger ms-auto" @click="moveInclusionCartToMain()">Add all</button>
              </div>
              <div class="card">
                <div class="card-body">
                  <span><strong>No. of items:</strong> {{ countInclusion }}</span><br />
                  <span><strong>Total:</strong> {{ sumInclusion }}</span>
                </div>
              </div>

              <div class="card-deck" style="  max-height: 545px;overflow-y: auto;overflow-x: hidden;padding-right: 1px;">
                <div class="card" v-for="(item, index) in filteredInclusionCart" :key="item.id">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <button v-if="item.category === 'inclusion'" type="button" class="btn btn-sm btn-close"
                      aria-label="Close" @click="cancelItem(item)"></button>
                  </div>
                  <div class="card-body">
                    <p class="card-text">Type: {{ item.type }}</p>
                    <p class="card-text">Price Rate: {{ item.priceRate }}</p>
                    <p class="card-text">Purchase Qty.:{{ item.purqty }}</p>
                    <p class="card-text">Total Price: {{ item.totalCartPrice }}</p>


                  </div>
                </div>
              </div>


            </div>
            <div class="col-md-3">
              <div class="d-flex align-items-center">
                <h2 class="position-relative">
                  Order Summary
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style="font-size: 0.75rem;">
                    {{ numItemCart }}
                    <span class="visually-hidden">items in cart</span>
                  </span>
                </h2>
                <button v-if="this.itemIndex === -1" type="button" class="btn btn-primary ms-auto" @click="toggleAddAccountModal()">
                  <i class="bi bi-plus"></i>
                </button>
              </div>


              <div class="card">
                <div class="card-body">
                  <span><strong>Name:</strong> {{ billing.clientName }}</span><br />
                  <span><strong>Email:</strong> {{ billing.clientEmail }}</span><br />
                  <span><strong>Phone:</strong> {{ billing.clientPhone }}</span><br />
                  <span><strong>Address:</strong> {{ billing.clientAddress }}</span>
                </div>
              </div>
              <div class="card-deck wrapper-content" style="max-height: 500px!important;">
                <div class="card" v-for="(item, index) in filteredCart" :key="item.id">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <button v-if="item.category === 'inclusion'" type="button" class="btn btn-sm btn-close"
                      aria-label="Close" @click="cancelItem(item)"></button>
                  </div>
                  <div class="card-body">
                    <p class="card-text">Type: {{ item.type }}</p>
                    <p class="card-text">Price Rate: {{ item.priceRate }}</p>
                    <p class="card-text">Purchase Qty.:{{ item.purqty }}</p>
                    <p class="card-text">Total Price: {{ item.totalCartPrice }}</p>


                  </div>
                </div>
              </div>

            </div>
            <div class="col-md-3">
              <h2>Payment Transaction</h2>
              <div class="container">
                <form>
                  <div class="form-group">
                    <label for="paymentMethod">Payment method:</label>
                    <select class="form-control" id="paymentMethod" v-model="paymentMethod">
                      <option value="cash">Cash</option>
                      <option value="non-cash">Non-cash</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="cashAmount">Cash amount:</label>
                    <input type="number" class="form-control" id="cashAmount" v-model="cashAmount">
                  </div>
                  <div v-if="paymentMethod === 'non-cash'" class="form-group">
                    <label for="nonCashReference">Reference No.:</label>
                    <input type="text" class="form-control" id="nonCashReference" v-model="nonCashReference">
                  </div>
                  <div v-if="alreadyDiscounted === false" class="form-group">
                    <label for="discountMode">Discount mode:</label>
                    <select class="form-control" id="discountMode" v-model="discountMode">
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed amount</option>
                    </select>
                  </div>
                  <div v-if="alreadyDiscounted === false" class="form-group">
                    <label for="discountValue">Discount value:</label>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text" v-if="discountMode === 'percentage'">&#37;</span>
                        <span class="input-group-text" v-else>Php</span>
                      </div>
                      <input type="number" class="form-control" id="discountValue" v-model="discountValue">
                    </div>
                  </div>
                  <div class="form-group mb-2">
                    <label class="font-weight-bold">Summary:</label>
                    <div class="form-control p-3">
                      <div class="row mb-2">
                        <div class="col-6"><strong>Reservation:</strong></div>
                        <div class="col-6 text-right" v-html="subroom.original + ' ' + subroom.discounted"></div>
                      </div>

                      <div class="row mb-2">
                        <div class="col-6"><strong>Add-ons:</strong></div>
                        <div class="col-6 text-right">{{ subaddons }}</div>
                      </div>
                      <hr class="my-2">
                      <div class="row mb-2">
                        <div class="col-6"><strong>Subtotal:</strong></div>
                        <div class="col-6 text-right">{{ subtotal }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-6"><strong>Partial Payment:</strong></div>
                        <div class="col-6 text-right">{{ partialPayment }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-6"><strong class="text-primary" style="font-size: 24px;">Total:</strong></div>
                        <div class="col-6 text-right"><strong style="font-size: 24px;">{{ total }}</strong></div>
                      </div>
                      <div class="row">
                        <div class="col-6"><strong style="font-size: 24px;">Change:</strong></div>
                        <div class="col-6 text-right" style="font-size: 24px;">{{ change }}</div>
                      </div>
                    </div>
                  </div>



                  <button type="button" class="btn btn-primary" @click="generateBillingStatement">Generate
                    BS</button>&nbsp;
                  <button type="button" class="btn btn-success" @click="placeOrder" :disabled="total <= 0 || countInclusion > 0">Place
                    Order</button>
                </form>
              </div>
            </div>


          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="reports" role="tabpanel" aria-labelledby="reports-tab">
        <div class="container-fluid">

          <div class="row">
            <div class="row">
              <div class="col-sm-1">
                <ul class="nav nav-tabs flex-column">
                  <li class="nav-item">
                    <a class="nav-link rotated-text active" data-bs-toggle="tab" href="#reservations">Reservations</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link rotated-text" data-bs-toggle="tab" href="#transactions">Transactions</a>
                  </li>
                </ul>
              </div>
              <div class="col-sm-11">
                <div class="tab-content">
                  <div id="reservations" class="tab-pane active">


                    <div class="row">
                      <div class="col-md-3">
                        <div>
                          <div class="form-group">
                            <label for="search">Search Reservation:</label>
                            <div class="input-group">
                              <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button">
                                  <i class="fa fa-search"></i>
                                </button>
                              </div>
                              <input type="text" class="form-control" placeholder="Search reservation"
                                v-model="searchTerm2">

                            </div>
                          </div>
                          <div class="form-group">
                            <label for="date-filter">Date Filter:</label>
                            <select class="form-control" id="date-filter" v-model="resdateFilter">
                              <option value="any">Any</option>
                              <option value="range">Date Range</option>
                            </select>
                            <div v-if="resdateFilter === 'range'">
                              <div class="form-group">
                                <input type="date" class="form-control" v-model="resfromDate">
                              </div>
                              <div class="form-group">
                                <input type="date" class="form-control" v-model="restoDate">
                              </div>
                            </div>
                          </div>
                          <div class="form-group">
                            <label for="payment-method-filter">Payment Status:</label>
                            <select class="form-control" id="payment-method-filter" v-model="respaymentStatusFilter">
                              <option value="">Any</option>
                              <option value="no">No Payment</option>
                              <option value="partial">Partial</option>
                              <option value="yes">Full</option>
                            </select>
                          </div>
                          <div class="form-group">
                            <label for="status-filter">Status:</label>
                            <select class="form-control" id="status-filter" v-model="resstatusFilter">
                              <option value="">Any</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="reserved">Reserved</option>
                              <option value="checkedin">Occupied</option>
                              <option value="checkedout">Checked Out</option>
                            </select>
                          </div>
                          <div class="form-group mt-2">
                            <button type="button" class="btn btn-primary"
                              @click="printReservationHistory">Print</button>&nbsp;
                          </div>
                        </div>
                      </div>
                      <div class="col-md-9">
                        <div id="reservationHistory">
                          <h2>Reservation History</h2>

                          <table class="table">
                            <thead>
                              <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Address</th>
                                <th>Checkin Date</th>
                                <th>Checkout Date</th>
                                <th>Room</th>
                                <th>Cost</th>
                                <th>Status</th>
                                <th>Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="reservation in filteredReservationsHistory" :key="reservation.transactionID">
                                <td>{{ reservation.id }}</td>
                                <td>{{ reservation.name }}</td>
                                <td>{{ reservation.contactNumber }}</td>
                                <td>{{ reservation.clientaddress }}</td>
                                <td>{{ reservation.checkinDate }}</td>
                                <td>{{ reservation.checkoutDate }}</td>
                                <td>{{ reservation.room_name }}</td>
                                <td>{{ reservation.totalPrice }}</td>
                                <td>{{ reservation.status }}</td>
                                <td>{{ reservation.isPaid }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>


                      </div>
                    </div>
                  </div>
                  <div id="transactions" class="tab-pane">

                    <div class="row">
                      <div class="col-md-3">
                        <div>
                          <div class="form-group">
                            <label for="search">Search Transaction:</label>
                            <div class="input-group">
                              <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button">
                                  <i class="fa fa-search"></i>
                                </button>
                              </div>
                              <input type="text" class="form-control" placeholder="Search transaction"
                                v-model="searchTerm" id="search">

                            </div>
                          </div>
                          <div class="form-group">
                            <label for="date-filter">Date Filter:</label>
                            <select class="form-control" id="date-filter" v-model="dateFilter">
                              <option value="any">Any</option>
                              <option value="range">Date Range</option>
                            </select>
                            <div v-if="dateFilter === 'range'">
                              <div class="form-group">
                                <input type="date" class="form-control" v-model="fromDate">
                              </div>
                              <div class="form-group">
                                <input type="date" class="form-control" v-model="toDate">
                              </div>
                            </div>
                          </div>
                          <div class="form-group">
                            <label for="payment-method-filter">Payment Method:</label>
                            <select class="form-control" id="payment-method-filter" v-model="paymentMethodFilter">
                              <option value="">Any</option>
                              <option value="cash">Cash</option>
                              <option value="non-cash">Non-cash</option>
                            </select>
                          </div>
                          <div class="form-group">
                            <label for="status-filter">Status:</label>
                            <select class="form-control" id="status-filter" v-model="statusFilter">
                              <option value="">Any</option>
                              <option value="full">Full</option>
                              <option value="partial">Partial</option>
                            </select>
                          </div>
                          <div class="form-group mt-2">
                            <button type="button" class="btn btn-primary"
                              @click="printTransactionHistory">Print</button>&nbsp;
                          </div>
                        </div>
                      </div>
                      <div class="col-md-9">
                        <div id="transactionHistory">
                          <h2>Transaction History</h2>

                          <table class="table">
                            <thead>
                              <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Address</th>
                                <th>Total Amount</th>
                                <th>Payment Method</th>
                                <th>Cash</th>
                                <th>Discount</th>
                                <th>Balance</th>
                                <th>Status</th>
                                <th>Transaction Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="transaction in filteredTransactions" :key="transaction.transactionID">
                                <td>{{ transaction.id }}</td>
                                <td>{{ transaction.clientname }}</td>
                                <td>{{ transaction.clientcontact }}</td>
                                <td>{{ transaction.clientaddress }}</td>
                                <td>{{ transaction.totalAmountToPay }}</td>
                                <td>{{ transaction.paymentMethod }}</td>
                                <td>{{ transaction.cashAmountPay }}</td>
                                <td>{{ transaction.discountValue }}{{ transaction.discountMode }}</td>
                                <td>{{ transaction.balance }}</td>
                                <td>{{ transaction.payStatus }}</td>
                                <td>{{ transaction.transaction_date }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>



          <div class="row">

            <!--<div class="col-md-6">
              <h2>Reservations Chart</h2>
              <div style="height:350px">
                <Line :data="linedata" :options="lineoptions" />
              </div>


            </div>

            <div class="col-md-6">
              <h2>Sales Chart</h2>
              <div style="height:350px">
                <Line :data="linedata" :options="lineoptions" />
              </div>
            </div>-->
          </div>


        </div>
      </div>
    </div>

    <div id="billing-details" class="container-fluid billing">
      <div class="container">
        <div class="row justify-content-between">
          <div class="col-4">
            <img src="http://localhost:5173/src/assets/pantukan-waterworld-logo.jpg" width="60" height="60"
              alt="Company Logo" class="logo">
          </div>
          <div class="col-4 text-right">
            <h4>Billing Statement</h4>
            <p>Transaction No.: {{ this.billing.bookingID }}</p>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="col-6">
            <h5>Client Details:</h5>
            <p>Name: {{ this.billing.clientName }}</p>
            <p>Email: {{ this.billing.clientEmail }}</p>
            <p>Contact No.: {{ this.billing.clientPhone }}</p>
            <p>Address.: {{ this.billing.clientAddress }}</p>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="col-12">
            <h5>Order Details:</h5>
            <table class="table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Rate</th>
                  <th>Qty</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cart" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.priceRate }}</td>
                  <td>{{ item.purqty }}</td>
                  <td v-if="item.itemOption !== 'room'">{{ item.totalCartPrice }}</td>
                  <td v-else v-html="subroom.original + ' ' + subroom.discounted"></td>
                </tr>
                <tr>
                  <td colspan="4" class="text-right"><strong>Total Due:</strong></td>
                  <td><strong>Php {{ total }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="col-12">
            <h5>Terms &amp; Conditions:</h5>
            <p>1. Check-in time is at 2:00 PM. Check-out time is at 12:00 PM.</p>
            <p>2. Late check-out is subject to availability and may be charged an additional fee.</p>
            <p>3. Smoking is strictly prohibited inside the resort premises.</p>
            <p>4. Pets are not allowed inside the resort.</p>
            <p>5. Any damage or loss to the resort property will be charged to the guest.</p>
            <p>6. The resort reserves the right to refuse service to anyone.</p>
            <p>7. All rates are inclusive of taxes and service charge.</p>
            <p>8. Payment must be settled upon check-out.</p>
            <p>9. The resort is not responsible for any loss or damage to personal belongings.</p>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="col-6">
            <h5>Customer Signature:</h5>
            <hr>
          </div>
          <div class="col-6 text-right">
            <h5>Check-In Staff Signature:</h5>
            <hr>
            <p>Date: {{ currentDate }}</p>
          </div>
        </div>
      </div>

    </div>

  </div>

  <!-- Modals -->
  <div class="modal fade show" id="showall-modal" tabindex="-1" role="dialog" aria-labelledby="showall-modalLabel"
    style="display: none; padding-right: 17px;" aria-modal="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content" style="">
        <div class="modal-header">


          <h4 class="modal-title" id="showall-modalLabel">Room Status</h4>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">

          <ul class="nav nav-tabs" id="roomTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="cancelled-tab" data-bs-toggle="tab" data-bs-target="#cancelled" type="button"
                role="tab" aria-controls="cancelled" aria-selected="true"
                @click="activeTab = 'cancelled'">Cancelled</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="reserved-tab" data-bs-toggle="tab" data-bs-target="#reserved" type="button"
                role="tab" aria-controls="reserved" aria-selected="true" @click="activeTab = 'reserved'">Reserved</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="occupied-tab" data-bs-toggle="tab" data-bs-target="#occupied" type="button"
                role="tab" aria-controls="occupied" aria-selected="false"
                @click="activeTab = 'occupied'">Occupied</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="checkedout-tab" data-bs-toggle="tab" data-bs-target="#checkedout" type="button"
                role="tab" aria-controls="checkedout" aria-selected="false" @click="activeTab = 'checkedout'">Checked
                Out</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="all-tab" data-bs-toggle="tab" data-bs-target="#all" type="button"
                role="tab" aria-controls="all" aria-selected="false" @click="activeTab = 'all'">All</button>
            </li>
          </ul>

          <div class="tab-content mt-3" id="roomTabContent">
            <div class="tab-pane fade" :class="{ 'show active': activeTab === 'cancelled' }" id="cancelled"
              role="tabpanel" aria-labelledby="cancelled-tab">
              <div class="container-fluid">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Room Name</th>
                      <th>Checkin Date</th>
                      <th>Checkout Date</th>
                      <th>Guest</th>
                      <th>Contact Number</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="reservation in filteredRoomBookings" :key="reservation.id">
                      <td>{{ reservation.room_name }}</td>
                      <td>{{ reservation.checkinDate }}</td>
                      <td>{{ reservation.checkoutDate }}</td>
                      <td>{{ reservation.name }}</td>
                      <td>{{ reservation.contactNumber }}</td>
                      <td>{{ reservation.clientemail }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="tab-pane fade" :class="{ 'show active': activeTab === 'reserved' }" id="reserved" role="tabpanel"
              aria-labelledby="reserved-tab">
              <div class="container-fluid">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Room Name</th>
                      <th>Checkin Date</th>
                      <th>Checkout Date</th>
                      <th>Guest</th>
                      <th>Contact Number</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="reservation in filteredRoomBookings" :key="reservation.id">
                      <td>{{ reservation.room_name }}</td>
                      <td>{{ reservation.checkinDate }}</td>
                      <td>{{ reservation.checkoutDate }}</td>
                      <td>{{ reservation.name }}</td>
                      <td>{{ reservation.contactNumber }}</td>
                      <td>{{ reservation.clientemail }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="tab-pane fade" :class="{ 'show active': activeTab === 'occupied' }" id="occupied" role="tabpanel"
              aria-labelledby="occupied-tab">
              <div class="container-fluid">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Room Name</th>
                      <th>Checkin Date</th>
                      <th>Checkout Date</th>
                      <th>Guest</th>
                      <th>Contact Number</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="reservation in filteredRoomBookings" :key="reservation.id">
                      <td>{{ reservation.room_name }}</td>
                      <td>{{ reservation.checkinDate }}</td>
                      <td>{{ reservation.checkoutDate }}</td>
                      <td>{{ reservation.name }}</td>
                      <td>{{ reservation.contactNumber }}</td>
                      <td>{{ reservation.clientemail }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="tab-pane fade" :class="{ 'show active': activeTab === 'checkedout' }" id="checkedout"
              role="tabpanel" aria-labelledby="checkedout-tab">
              <div class="container-fluid">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Room Name</th>
                      <th>Checkin Date</th>
                      <th>Checkout Date</th>
                      <th>Guest</th>
                      <th>Contact Number</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="reservation in filteredRoomBookings" :key="reservation.id">
                      <td>{{ reservation.room_name }}</td>
                      <td>{{ reservation.checkinDate }}</td>
                      <td>{{ reservation.checkoutDate }}</td>
                      <td>{{ reservation.name }}</td>
                      <td>{{ reservation.contactNumber }}</td>
                      <td>{{ reservation.clientemail }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="tab-pane fade" :class="{ 'show active': activeTab === 'all' }" id="all" role="tabpanel"
              aria-labelledby="all-tab">
              <div class="container-fluid">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Room Name</th>
                      <th>Checkin Date</th>
                      <th>Checkout Date</th>
                      <th>Guest</th>
                      <th>Contact Number</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="reservation in filteredRoomBookings" :key="reservation.id">
                      <td>{{ reservation.room_name }}</td>
                      <td>{{ reservation.checkinDate }}</td>
                      <td>{{ reservation.checkoutDate }}</td>
                      <td>{{ reservation.name }}</td>
                      <td>{{ reservation.contactNumber }}</td>
                      <td>{{ reservation.clientemail }}</td>
                      <td>{{ reservation.status }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade show" id="addAccountModal" tabindex="-1" role="dialog" aria-labelledby="addAccountModalLabel"
    style="display: none; padding-right: 17px;" aria-modal="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content" style="">
        <div class="modal-header">


          <h4 class="modal-title" id="addAccountModalLabel">Add Account</h4>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">

          <form @submit.prevent="addWalkInGuest">
            <!-- Client Information -->
            <div class="form-group row">
              <label for="name" class="col-sm-2 col-form-label">Name:</label>
              <div class="col-sm-4">
                <input type="text" class="form-control" id="name" v-model="walkinreservation.clientName" required>
              </div>
              <label for="email" class="col-sm-2 col-form-label">Email:</label>
              <div class="col-sm-4">
                <input type="email" class="form-control" id="email" v-model="walkinreservation.clientEmail" required>
              </div>
            </div>
            <div class="form-group row">
              <label for="address" class="col-sm-2 col-form-label">Address:</label>
              <div class="col-sm-4">
                <input type="text" class="form-control" id="address" v-model="walkinreservation.clientAddress" required>
              </div>
              <label for="phone" class="col-sm-2 col-form-label">Phone:</label>
              <div class="col-sm-4">
                <input type="tel" class="form-control" id="phone" v-model="walkinreservation.clientPhone" required>
              </div>
            </div>

            <div class="form-group row">
              <label for="nationality" class="col-sm-2 col-form-label">Nationality:</label>
              <div class="col-sm-4">

                <select class="form-control" id="nationality" v-model="walkinreservation.clientNationality" required>
                  <option value="">-- Please select --</option>
                  <option value="Filipino">Filipino</option>
                  <option value="Foreign">Foreign</option>
                </select>
              </div>
              <label for="clientType" class="col-sm-2 col-form-label">Type:</label>
              <div class="col-sm-4">
                <select class="form-control" id="clientType" v-model="walkinreservation.clientType" required>
                  <option value="">-- Please select --</option>
                  <option value="walkin">Walk-in</option>
                  <option value="vip">VIP</option>
                  <option value="regular">Regular</option>
                  <option value="group">Group</option>
                  <option value="corporate">Corporate</option>
                  <option value="wedding">Wedding</option>
                  <option value="honeymoon">Honeymoon</option>
                  <option value="family">Family</option>
                  <option value="backpacker">Backpacker</option>
                  <option value="senior">Senior</option>
                  <option value="disabled">Disabled</option>
                  <option value="travel_agent">Travel agent</option>
                </select>
              </div>
            </div>
            <div class="form-group row">
              <div class="mt-3 mb-3 d-flex flex-row-reverse">
                <button type="submit" class="btn btn-primary">Add</button>&nbsp;
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>

  <div class="modal fade show" id="settings-modal" tabindex="-1" role="dialog" aria-labelledby="settings-modalLabel"
    style="display: none; padding-right: 17px;" aria-modal="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content" style="">
        <div class="modal-header">


          <h4 class="modal-title" id="settings-modalLabel">Settings</h4>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Period UOM</label>
                <div class="input-group">
                  <select class="form-select" v-model="displayPeriodUom">
                    <option>month</option>
                    <option>week</option>
                    <option>year</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Period Count</label>
                <div class="input-group">
                  <select class="form-select" v-model="displayPeriodCount">
                    <option :value="1">1</option>
                    <option :value="2">2</option>
                    <option :value="3">3</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Starting day of the week</label>
                <div class="input-group">
                  <select class="form-select" v-model="startingDayOfWeek">
                    <option v-for="(d, index) in dayNames" :key="index" :value="index">
                      {{ d }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group form-check">
                <input class="form-check-input" type="checkbox" v-model="useTodayIcons" />
                <label class="form-check-label">Use icon for today's period</label>
              </div>

              <div class="form-group form-check">
                <input class="form-check-input" type="checkbox" v-model="displayWeekNumbers" />
                <label class="form-check-label">Show week number</label>
              </div>

              <div class="form-group form-check">
                <input class="form-check-input" type="checkbox" v-model="showTimes" />
                <label class="form-check-label">Show times</label>
              </div>

              <div class="form-group">
                <label class="form-label">Themes</label>
              </div>

              <div class="form-group form-check">
                <input class="form-check-input" type="checkbox" v-model="useDefaultTheme" />
                <label class="form-check-label">Default</label>
              </div>

              <div class="form-group form-check">
                <input class="form-check-input" type="checkbox" v-model="useHolidayTheme" />
                <label class="form-check-label">Holidays</label>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Status</th>
                      <th scope="col">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Cancelled</td>
                      <td style="background-color: gray; width: 25px;"></td>
                    </tr>
                    <tr>
                      <td>Reserved</td>
                      <td style="background-color: red; width: 25px;"></td>
                    </tr>
                    <tr>
                      <td>Reserved (partially paid)</td>
                      <td style="background-color: violet; width: 25px;"></td>
                    </tr>
                    <tr>
                      <td>Checked In</td>
                      <td style="background-color: green; width: 25px;"></td>
                    </tr>
                    <tr>
                      <td>Checked In (partially paid)</td>
                      <td style="background-color: blue; width: 25px;"></td>
                    </tr>
                    <tr>
                      <td>Checked In (paid)</td>
                      <td style="background-color: yellow; width: 25px;"></td>
                    </tr>
                    <tr>
                      <td>Checked Out (paid)</td>
                      <td style="background-color: orange; width: 25px;"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>


        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade show" id="BookDayModal" tabindex="-1" role="dialog" aria-labelledby="BookDayModalLabel"
    style="display: none; padding-right: 17px;" aria-modal="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content" style="">
        <div class="modal-header">
          <h4 id="BookDayModalLabel">Reservation Info</h4>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">

          <form @submit.prevent="clickTestAddItem">
            <!-- Client Information -->
            <h4>Client Info</h4>
            <div class="form-group row">
              <label for="name" class="col-sm-2 col-form-label">Name:</label>
              <div class="col-sm-4">
                <input type="text" class="form-control" id="name" v-model="reservation.clientName" required>
              </div>
              <label for="email" class="col-sm-2 col-form-label">Email:</label>
              <div class="col-sm-4">
                <input type="email" class="form-control" id="email" v-model="reservation.clientEmail" required>
              </div>
            </div>
            <div class="form-group row">
              <label for="address" class="col-sm-2 col-form-label">Address:</label>
              <div class="col-sm-4">
                <input type="text" class="form-control" id="address" v-model="reservation.clientAddress" required>
              </div>
              <label for="phone" class="col-sm-2 col-form-label">Phone:</label>
              <div class="col-sm-4">
                <input type="tel" class="form-control" id="phone" v-model="reservation.clientPhone" required>
              </div>
            </div>

            <div class="form-group row">
              <label for="nationality" class="col-sm-2 col-form-label">Nationality:</label>
              <div class="col-sm-4">

                <select class="form-control" id="nationality" v-model="reservation.clientNationality" required>
                  <option value="">-- Please select --</option>
                  <option value="Filipino">Filipino</option>
                  <option value="Foreign">Foreign</option>
                </select>
              </div>
              <label for="clientType" class="col-sm-2 col-form-label">Type:</label>
              <div class="col-sm-4">
                <select class="form-control" id="clientType" v-model="reservation.clientType" required>
                  <option value="">-- Please select --</option>
                  <option value="walkin">Walk-in</option>
                  <option value="vip">VIP</option>
                  <option value="regular">Regular</option>
                  <option value="group">Group</option>
                  <option value="corporate">Corporate</option>
                  <option value="wedding">Wedding</option>
                  <option value="honeymoon">Honeymoon</option>
                  <option value="family">Family</option>
                  <option value="backpacker">Backpacker</option>
                  <option value="senior">Senior</option>
                  <option value="disabled">Disabled</option>
                  <option value="travel_agent">Travel agent</option>
                </select>
              </div>
            </div>
            <h4>Booking Details</h4>
            <div class="form-group row">
              <label for="checkin" class="col-sm-2 col-form-label">Check-in Date:</label>
              <div class="col-sm-4">
                <input type="text" class="form-control" id="checkin" v-model="reservation.checkinDate" required readonly>
              </div>
              <label for="checkout" class="col-sm-2 col-form-label">Check-out Date:</label>
              <div class="col-sm-4">
                <input type="text" class="form-control" id="checkout" v-model="reservation.checkoutDate" required
                  readonly>
              </div>
            </div>
            <div class="form-group row">
              <label for="room" class="col-sm-2 col-form-label">Room:</label>
              <div v-if="this.reservation.status == 'vacant'" class="col-sm-4">

                <v-select :options="updatedRooms" label="name" v-model="reservation.roomName" required>
                  <template #option="{ name, type, price }">
                    <h6 style="margin: 0">{{ name }}</h6>
                    <em><small>{{ type }}</small></em>
                    <em><small> ({{ price }} units)</small></em>
                  </template>
                </v-select>
              </div>
              <div v-else class="col-sm-4">
                <input type="text" class="form-control" v-model="reservation.roomName" readonly>
              </div>
              <label for="guests" class="col-sm-2 col-form-label">No. of Guests:</label>
              <div class="col-sm-4">
                <input type="number" class="form-control" id="guests" v-model="reservation.numGuests" required>
              </div>
            </div>
            <div class="form-group row">
              <div class="mt-3 mb-3 d-flex flex-row-reverse">
                <div v-if="this.reservation.status == 'reserved'">
                  <button type="button" class="btn btn-primary" @click="cancelReservation()">Cancel
                    Reservation</button>&nbsp;
                  <button v-if="this.reservation.isPaid == '' || this.reservation.isPaid == 'no'" @click="moveToCart()"
                    type="button" class="btn btn-success">Down Payment</button>
                  &nbsp;
                  <button type="button" class="btn btn-success" @click="checkinGuest()">Check-in</button>
                </div>
                <div v-else-if="this.reservation.status == 'checkedin'">
                  <button v-if="this.reservation.isPaid == '' || this.reservation.isPaid == 'no'" @click="moveToCart()"
                    type="button" class="btn btn-success">Pay Now</button>
                  <button v-else-if="this.reservation.isPaid == 'partial'" @click="moveToCart()" type="button"
                    class="btn btn-success">Pay Now</button>
                  <div v-else>
                    <button type="button" class="btn btn-success" @click="viewSummary()">View Summary</button>&nbsp;
                    <button type="button" class="btn btn-success" @click="checkOutGuest()">Check-out</button>
                  </div>

                </div>
                <button v-else-if="this.reservation.status == 'vacant'" type="submit" class="btn btn-primary">Book
                  Now</button> &nbsp;
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </form>


        </div>

      </div>
    </div>
  </div>

  <vue-simple-context-menu element-id="myFirstMenu" :options="optionsArray1" ref="vueSimpleContextMenu1"
    @option-clicked="optionClicked1">
  </vue-simple-context-menu>
</template>
<script>
import { useAuthStore } from "@/stores/authStore";
import "/node_modules/vue-simple-calendar/dist/style.css"
import "/node_modules/vue-simple-calendar/dist/css/default.css"
import "/node_modules/vue-simple-calendar/dist/css/holidays-us.css"
import "/node_modules/vue-final-modal/dist/style.css"

import jsPDF from "jspdf";
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { CalendarView, CalendarViewHeader, CalendarMath } from "vue-simple-calendar" // published version

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

//helper functions
function parseDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`).setHours(0, 0, 0, 0);
}

export default {
  components: {
    Line,
    CalendarView,
    CalendarViewHeader,
  },
  data() {
    return {
      resdateFilter: 'any',
      resfromDate: null,
      restoDate: null,
      respaymentStatusFilter: '',
      resstatusFilter: '',

      dateFilter: 'any',
      fromDate: null,
      toDate: null,
      paymentMethodFilter: '',
      statusFilter: '',

      convDate: "",
      optionsArray1: [
        {
          name: 'Show Account',
          slug: 'show',
        },
        {
          type: 'divider',
        },
        {
          name: 'Edit',
          slug: 'edit',
        },
        {
          name: '<em>Delete</em>',
          slug: 'delete',
        },
      ],
      itemIndex: -1,
      walkinreservation: {
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        clientNationality: '',
        clientType: ''
      },
      reservation: {
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        clientNationality: '',
        clientType: '',
        checkinDate: '',
        checkoutDate: '',
        roomName: '',
        roomPrice: '',
        roomType: '',
        numGuests: '',
        status: 'vacant',
        isPaid: 'no'
      },
      showDate: this.thisMonth(1),
      message: "",
      startingDayOfWeek: 0,
      disablePast: false,
      disableFuture: false,
      displayPeriodUom: "month",
      displayPeriodCount: 1,
      displayWeekNumbers: false,
      showTimes: true,
      selectionStart: null,
      selectionEnd: null,
      newItemTitle: "",
      newItemStartDate: "",
      newItemEndDate: "",
      useDefaultTheme: true,
      useHolidayTheme: true,
      useTodayIcons: false,
      bookings: [],
      calendarItems: [
        /*{
            id: id,
            startDate: this.thisMonth(day, hr, min),
            endDate: this.thisMonth(day, hr, min),
            title: book.title,
            classes: "purple",
            tooltip: "This spans multiple days hehe",
        },*/
      ],
      linedata: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Cancelled',
            backgroundColor: 'gray',
            data: [50, 29, 1, 4, 37, 80, 40]
          },
          {
            label: 'Reserved',
            backgroundColor: 'red',
            data: [40, 39, 10, 40, 39, 80, 40]
          },
          {
            label: 'Check-in',
            backgroundColor: 'green',
            data: [40, 39, 10, 40, 39, 80, 40]
          },
          {
            label: 'Check-out',
            backgroundColor: 'yellow',
            data: [40, 39, 10, 40, 39, 80, 40]
          }
        ]
      },
      lineoptions: {
        responsive: true,
        maintainAspectRatio: false
      },

      paymentMethod: 'cash',
      cashAmount: 0,
      nonCashReference: '',
      discountMode: 'percentage',
      discountValue: 0,
      partialPayment: 0,

      activeTab: 'all',
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      clientNationality: "",
      clientType: "",
      transactions: [],
      rooms: [],
      howMany: [],
      choice_room: null,
      items: [],
      inclusionCart: [],
      cart: [],
      itemCart: {
        id: 0,
        name: "",
        type: "",
        priceRate: "",
        rate: "",
        counter: "",
        purqty: "",
        totalCartPrice: "",
        category: "",
        itemOption: ""
      },
      billing: {
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        clientAddress: "",
        clientNationality: "",
        clientType: "",
        bookingID: ""
      },
      reservations: [],
      searchText1: "",
      searchText2: "",
      searchText3: "",
      searchText4: "",
      searchTerm: "",
      searchTerm2: "",
      walkinStatus: false,
      alreadyDiscounted: false
    };
  },
  created() {
    this.reloadData();
    this.reloadItemsData();
    this.loadTransactionData();
  },
  computed: {
    userdata() {
      const authStore = useAuthStore();
      const user = authStore.user;
      return user;
    },
    filteredReservationsHistory() {
      let filtered = this.bookings.filter(reservation => {
        // Filter by date range
        if (this.resdateFilter === 'range' && this.resfromDate && this.restoDate) {
          const checkinDate = parseDate(reservation.checkinDate);
          const checkoutDate = parseDate(reservation.checkoutDate);
          const fromDate = parseDate(this.resfromDate);
          const toDate = parseDate(this.restoDate);
          return fromDate <= checkoutDate && toDate >= checkinDate;
        }
        return true;
      }).filter(reservation => {
        // Filter by payment method
        if (this.respaymentStatusFilter) {
          return reservation.isPaid === this.respaymentStatusFilter;
        }
        return true;
      }).filter(reservation => {
        // Filter by status
        if (this.resstatusFilter) {
          return reservation.status === this.resstatusFilter;
        }
        return true;
      });

      return filtered.map(item => {
        const searchCode = Object.values(item).join("~");
        return {
          ...item,
          searchCode
        };
      }).filter(item => item.searchCode.toString().toLowerCase().includes(this.searchTerm2.toLowerCase()));
    },
    filteredTransactionsTotal(){
      return this.filteredTransactions.reduce((acc, item) => acc + parseFloat(item.cashAmountPay), 0);
    },
    filteredTransactionsBalance(){
      return this.filteredTransactions.reduce((acc, item) => acc + parseFloat(item.balance), 0);
    },
    filteredTransactions() {
      let filtered = this.transactions;

      // Filter by date
      if (this.dateFilter === 'range' && this.fromDate && this.toDate) {
        filtered = filtered.filter(transaction => {
          return parseDate(transaction.transaction_date) >= parseDate(this.fromDate) && parseDate(transaction.transaction_date) <= parseDate(this.toDate);
        });
      }

      // Filter by payment method
      if (this.paymentMethodFilter) {
        filtered = filtered.filter(transaction => {
          return transaction.paymentMethod === this.paymentMethodFilter;
        });
      }

      // Filter by status
      if (this.statusFilter) {
        filtered = filtered.filter(transaction => {
          return transaction.payStatus === this.statusFilter;
        });
      }

      return filtered.map(item => {
        const searchCode = Object.values(item).join("~");
        return {
          ...item,
          searchCode
        };
      }).filter(item => item.searchCode.toString().toLowerCase().includes(this.searchTerm.toLowerCase()));
    },
    filteredRoomBookings() {
      const isCancelled = this.activeTab === 'cancelled';
      const isReserved = this.activeTab === 'reserved';
      const isOccupied = this.activeTab === 'occupied';
      const isCheckedout = this.activeTab === 'checkedout';
      const selectedDate = parseDate(this.convDate);

      return this.bookings.filter(booking => {
        const bookingCheckinDate = parseDate(booking.checkinDate);
        const bookingCheckoutDate = parseDate(booking.checkoutDate);
        const dateInRange = (selectedDate >= bookingCheckinDate && selectedDate <= bookingCheckoutDate);
        const isReservedMatch = !isReserved || booking.status === 'reserved';
        const isOccupiedMatch = !isOccupied || booking.status === 'checkedin';
        const isCancelledMatch = !isCancelled || booking.status === 'cancelled';
        const isCheckedoutMatch = !isCheckedout || booking.status === 'checkedout';

        return dateInRange && isCancelledMatch && isReservedMatch && isOccupiedMatch && isCheckedoutMatch;
      });
    },
    updatedRooms() {
      return this.rooms.filter(room => {
        // Check if there are any bookings for this room that overlap with the specified date range
        const overlappingBookings = this.bookings.filter(booking => booking.status !== 'cancelled').filter(booking => booking.status !== 'checkedout').filter(booking => {
          const checkInDate = parseDate(booking.checkinDate);
          const checkOutDate = parseDate(booking.checkoutDate);
          const startDate = parseDate(this.reservation.checkinDate);
          const endDate = parseDate(this.reservation.checkoutDate);

          return booking.room_name === room.name &&
            startDate <= checkOutDate && endDate >= checkInDate;
        });

        // Return true if there are no overlapping bookings
        return overlappingBookings.length === 0;
      });
    },
    userLocale() {
      return CalendarMath.getDefaultBrowserLocale
    },
    dayNames() {
      return CalendarMath.getFormattedWeekdayNames(this.userLocale, "long", 0)
    },
    themeClasses() {
      return {
        "theme-default": this.useDefaultTheme,
        "holiday-us-traditional": this.useHolidayTheme,
        "holiday-us-official": this.useHolidayTheme,
      }
    },
    myDateClasses() {
      // This was added to demonstrate the dateClasses prop. Note in particular that the
      // keys of the object are `yyyy-mm-dd` ISO date strings (not dates), and the values
      // for those keys are strings or string arrays. Keep in mind that your CSS to style these
      // may need to be fairly specific to make it override your theme's styles. See the
      // CSS at the bottom of this component to see how these are styled.
      const o = {}
      const theFirst = this.thisMonth(1)
      const ides = [2, 4, 6, 9].includes(theFirst.getMonth()) ? 15 : 13
      const idesDate = this.thisMonth(ides)
      o[CalendarMath.isoYearMonthDay(idesDate)] = "ides"
      o[CalendarMath.isoYearMonthDay(this.thisMonth(21))] = ["do-you-remember", "the-21st"]
      return o
    },
    currentDate() {
      const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }
      return new Date().toLocaleString('en-US', options)
    },
    subroom() {
      const mainRoomItems = this.cart.filter(item => item.category === 'main' && item.itemOption === 'room');
      const originalPrice = mainRoomItems.reduce((acc, item) => acc + parseFloat(item.totalCartPrice), 0);
      if (this.discount === 0) {
        return { original: originalPrice, discounted: '' };
      }
      const discountedPrice = originalPrice - this.discount;
      const discountAmount = this.discountMode === 'percentage' ? `${this.discountValue}%` : `₱${this.discountValue}`;
      const formattedOriginalPrice = `<del class="text-danger">${originalPrice}</del>`;
      const formattedDiscountedPrice = `<sup class="text-danger font-weight-bold">${discountAmount} off</sup> <span class="text-success font-weight-bold">${discountedPrice}</span>`;
      return { original: formattedOriginalPrice, discounted: formattedDiscountedPrice };
    },
    subaddons() {
      return this.cart.filter(item => item.category === 'main' && item.itemOption === 'addons').reduce((acc, item) => acc + parseFloat(item.totalCartPrice), 0);
    },
    subtotal() {
      return this.cart.filter(item => item.category === 'main').reduce((acc, item) => acc + parseFloat(item.totalCartPrice), 0) - this.discount;
    },
    sumInclusion() {
      return this.cart.filter(item => item.category === 'inclusion').reduce((acc, item) => acc + parseFloat(item.totalCartPrice), 0);
    },
    discount() {
      if (this.discountMode === 'percentage') {
        return (this.cart.filter(item => item.category === 'main').reduce((acc, item) => acc + parseFloat(item.totalCartPrice), 0) - this.subaddons) * this.discountValue / 100;
      } else {
        return this.discountValue;
      }
    },
    total() {
      return this.subtotal - this.partialPayment;
    },
    change() {
      return (this.cashAmount > this.total) ? this.cashAmount - this.total : 0;
    },
    countInclusion() {
      return this.cart.filter(item => item.category === 'inclusion').length;
    },
    numItemCart() {
      return this.cart.filter(item => item.category === 'main').length;
    },
    filteredCart() {
      return this.cart.map(o => {
        const searchCode = o.name;
        return {
          ...o,
          searchCode
        };
      }).filter(item => item.category === 'main');
    },
    filteredInclusionCart() {
      return this.cart.map(o => {
        return {
          ...o
        };
      }).filter(item => item.category === 'inclusion');
    },
    roomStatus() {
      return this.rooms.map(room => {
        const isVacant = this.vacantRoom(room.name);
        const searchCode = room.name + "~" + room.type + "~" + room.price;
        return {
          ...room,
          isVacant,
          searchCode
        };
      }).filter(rooms => rooms.searchCode.toString().toLowerCase().includes(this.searchText2.toLowerCase()));
    },
    filteredReservations() {
      return this.reservations.map(book => {
        const searchCode = book.name + "~" + book.checkinDate + "~" + book.checkoutDate + "~" + book.room_name;
        return {
          ...book,
          searchCode
        };
      }).filter(reservation => reservation.searchCode.toString().toLowerCase().includes(this.searchText1.toLowerCase()));
    },
    filteredItems() {
      return this.items.map(item => {
        const searchCode = item.item + "~" + item.type;
        return {
          ...item,
          searchCode
        };
      }).filter(item => item.searchCode.toString().toLowerCase().includes(this.searchText3.toLowerCase()));
    },
  },
  methods: {
    async logout() {
      const authStore = useAuthStore();
            const user = {
                username: authStore.user.username,
                FirstName: authStore.user.fName,
                LastName: authStore.user.lName,
                role: authStore.user.role
            }
            const response = await axios.put(`${this.API_URL}users/${authStore.user.id}/`, { ...user, isActive: false })
            if (response.data !== undefined) {
                authStore.logout();
                this.$router.push('/');
            } else {
                this.$swal({
                    icon: "error",
                    title: "Logout error. Please contact your admin for assistance!"
                });
            }
    },
    addWalkInGuest() {
      this.billing.clientName = this.walkinreservation.clientName;
      this.billing.clientEmail = this.walkinreservation.clientEmail;
      this.billing.clientPhone = this.walkinreservation.clientPhone;
      this.billing.clientAddress = this.walkinreservation.clientAddress;
      this.billing.clientNationality = this.walkinreservation.clientNationality;
      this.billing.clientType = this.walkinreservation.clientType;
      this.walkinStatus = true;
      this.toggleAddAccountModal();
    },
    async moveInclusionCartToMain() {
      const n = this.filteredInclusionCart.length;
      if (n > 0) {
        const result = await this.$swal.fire({
          title: 'Confirmation',
          text: 'This action will update your cart. Do you want to proceed?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, do it!',
          cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
          try {
            const updatedItems = [];

            // Loop through inclusion items in the cart
            this.cart.filter(item => item.category === 'inclusion').forEach(async (item, index) => {
              // Define the API endpoint and data for the PUT request
              const api = `${this.API_URL}transaction/item/${item.id}/`;
              const data = {
                itemName: item.name,
                itemType: item.type,
                itemPriceRate: item.priceRate,
                purchaseQty: item.purqty,
                totalCost: item.totalCartPrice,
                category: 'main',
                itemOption: 'addons',
              };

              try {
                data.bookingID = this.bookings[this.itemIndex].itemID;
                // Send PUT request to update the item
                const response = await axios.put(api, data);
                updatedItems.push(response.data);
              } catch (error) {
                data.bookingID = "walkin"
                updatedItems.push(data);
              }
            });

            // Wait for all PUT requests to finish before updating the local cart
            await Promise.all(this.cart.filter(item => item.category === 'inclusion').map(async (item) => {
              // Update the category of each inclusion item to 'main'
              item.category = 'main';

              // Find the updated version of the item in the list of updated items
              const updatedItem = updatedItems.find(updatedItem => updatedItem.id === item.id);

              // If the item was successfully updated, update the local cart with the new data
              if (updatedItem) {
                Object.assign(item, updatedItem);
              }
            }));
          } catch (error) {
            console.error(error);
          }
        }
      }
    },

    resetSummary(no) {
      this.cart = [];
      this.billing = {
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        clientAddress: "",
        clientNationality: "",
        clientType: "",
        bookingID: ""
      };
      this.walkinreservation = {
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        clientAddress: "",
        clientNationality: "",
        clientType: ""
      }
      this.subtotal = 0;
      this.partialPayment = 0;
      this.total = 0;
      this.discountValue = 0;
      this.change = 0;
      this.itemCart = {
        id: 0,
        name: "",
        type: "",
        priceRate: "",
        rate: "",
        counter: "",
        purqty: "",
        totalCartPrice: "",
        category: ""
      }
      this.alreadyDiscounted = false;
      this.itemIndex = -1;
      this.walkinStatus = false;
      if (no === 1 && this.billing.clientName === "") {
        this.toggleAddAccountModal();
      }
    },
    changeTab(tab) {
      this.activeTab = tab
    },
    //generic methods
    optionClicked1(event) {
      const item = event.item;
      const uniqID = item.substring(item.toString().indexOf("~") + 1, item.toString().lastIndexOf("~"));
      const action = event.option.slug;
      window.alert(action);
    },
    toggleAddAccountModal() {
      $("#addAccountModal").modal("toggle");
    },
    toggleItemModal() {
      $("#BookDayModal").modal("toggle");
    },
    toggleSettingsModal() {
      $("#settings-modal").modal("toggle");
    },
    toggleShowAllModal() {
      $("#showall-modal").modal("toggle");
    },
    changeItemColor(status) {
      let item = this.calendarItems[this.calendarItems.findIndex(o => o.id === this.bookings[this.itemIndex].itemID)];
      if (status === "checkedin") {
        item.classes = ["custom-date-class-green"];
      } else if (status === "cancelled") {
        item.classes = ["custom-date-class-gray"];
      } else if (status === "checkedout") {
        item.classes = ["custom-date-class-orange"];
      }
    },
    async viewSummary() {
      const item = this.bookings[this.itemIndex];
      const bookingID = item.itemID;
      this.cart = [];

      let existingTransaction = await axios.post(`${this.API_URL}transaction/filter/`, {
                columnName: 'bookingID',
                columnKey: bookingID
      });
      try {
        if(existingTransaction.length !== 0){
        let transaction = existingTransaction.data[0];
        this.discountMode = transaction.discountMode;
        this.discountValue = transaction.discountValue;
        if(transaction.discountValue > 0){
          this.alreadyDiscounted = true;
        }
        
      } 
      } catch (error) {
        
      }

      const response = await axios.post(`${this.API_URL}transaction/item/filter/`, [
        { "columnName": "bookingID", "columnKey": bookingID },
      ])
      if (response.data.length > 0) {
        try {
          response.data.forEach(item => {
            let newItem = {
              id: item.id,
              name: item.itemName,
              type: item.itemType,
              priceRate: item.itemPriceRate,
              purqty: item.purchaseQty,
              totalCartPrice: item.totalCost,
              category: item.category,
              itemOption: item.itemOption
            };
            this.cart.push(newItem);
          });
        } catch (error) {
          console.log(error);
        }
      }
      this.billing.clientName = item.name;
      this.billing.clientAddress = item.clientaddress;
      this.billing.clientPhone = item.contactNumber;
      this.billing.clientEmail = item.clientemail;
      this.billing.clientNationality = item.clientnationality;
      this.billing.clientType = item.clientType;
      this.billing.bookingID = item.id;
      this.partialPayment = item.partialPayment;
      this.toggleItemModal();

      $("#others-tab").tab('show');
    },
    async moveToCart() {
      const item = this.bookings[this.itemIndex];
      const bookingID = item.itemID;

      let existingTransaction = await axios.post(`${this.API_URL}transaction/filter/`, {
                columnName: 'bookingID',
                columnKey: bookingID
      });
      try {
        if(existingTransaction.length !== 0){
        let transaction = existingTransaction.data[0];
        this.discountMode = transaction.discountMode;
        this.discountValue = transaction.discountValue;
        if(transaction.discountValue > 0){
          this.alreadyDiscounted = true;
        }
      } 
      } catch (error) {
        
      }

      const response = await axios.post(`${this.API_URL}transaction/item/filter/`, [
        { "columnName": "bookingID", "columnKey": bookingID },
        { "columnName": "itemName", "columnKey": item.room_name }
      ])
      if (response.data.length === 0) {

        const numDays = Math.ceil((new Date(item.checkoutDate.split('/')[2] + "-" + item.checkoutDate.split('/')[1] + "-" + item.checkoutDate.split('/')[0]).setHours(0, 0, 0, 0) - new Date(item.checkinDate.split('/')[2] + "-" + item.checkinDate.split('/')[1] + "-" + item.checkinDate.split('/')[0]).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));

        this.itemCart.id = this.cart.length + 1;
        this.itemCart.name = item.room_name;
        this.itemCart.type = item.room_type;
        this.itemCart.priceRate = item.room_price + "/check-in";
        this.itemCart.purqty = numDays + 1;
        this.itemCart.totalCartPrice = parseFloat(item.room_price) * (numDays + 1);
        this.itemCart.category = "main";
        this.itemCart.itemOption = "room";

        const data = {
          bookingID: this.bookings[this.itemIndex].itemID,
          itemName: this.itemCart.name,
          itemType: this.itemCart.type,
          itemPriceRate: this.itemCart.priceRate,
          purchaseQty: this.itemCart.purqty,
          totalCost: this.itemCart.totalCartPrice,
          category: this.itemCart.category,
          itemOption: this.itemCart.itemOption,
          dateCreated: new Date(), // Set the dateCreated field to the current date and time
        };

        // Make a POST request to the API to save the data
        await axios.post(this.API_URL + 'transaction/item/', data)
          .then(response => {
            // Log a success message to the console
            console.log('Data saved:', response.data);
          })
          .catch(error => {
            // Log an error message to the console
            console.error('Error saving data:', error);
          });
        this.cart.push(this.itemCart);
      } else {
        //show instead
        //update this.cart
        this.cart = [];
        const response = await axios.post(`${this.API_URL}transaction/item/filter/`, [
          { "columnName": "bookingID", "columnKey": bookingID },
        ])
        if (response.data.length > 0) {
          try {
            response.data.forEach(item => {
              let newItem = {
                id: item.id,
                name: item.itemName,
                type: item.itemType,
                priceRate: item.itemPriceRate,
                purqty: item.purchaseQty,
                totalCartPrice: item.totalCost,
                category: item.category,
                itemOption: item.itemOption
              };
              this.cart.push(newItem);
            });
          } catch (error) {
            console.log(error);
          }
        }
      }

      this.billing.clientName = item.name;
      this.billing.clientAddress = item.clientaddress;
      this.billing.clientPhone = item.contactNumber;
      this.billing.clientEmail = item.clientemail;
      this.billing.clientNationality = item.clientnationality;
      this.billing.clientType = item.clientType;
      this.billing.bookingID = item.id;
      this.partialPayment = item.partialPayment;
      this.toggleItemModal();

      $("#others-tab").tab('show');

      this.itemCart = {
        id: 0,
        name: "",
        priceRate: "",
        rate: "",
        counter: "",
        purqty: "",
        totalCartPrice: "",
        category: ""
      }


    },
    cancelReservation() {
      this.$swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'Are you sure you want to cancel this reservation?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true
      }).then((result) => {
        // Check if user confirmed the cancellation
        if (result.isConfirmed) {
          // Perform reservation cancellation logic here
          this.bookings[this.itemIndex].status = 'cancelled';
          this.bookings[this.itemIndex].cancellationDate = new Date();
          this.updateBookings(this.bookings[this.itemIndex].id);
          this.changeItemColor("cancelled");
          this.toggleItemModal();
          // Display success message using SweetAlert
          this.$swal.fire({
            icon: 'success',
            title: 'Reservation Canceled!',
            text: 'The reservation has been canceled.',
            confirmButtonText: 'OK'
          });
        }
      });
    },
    checkinGuest() {
      this.bookings[this.itemIndex].status = "checkedin";
      this.updateBookings(this.bookings[this.itemIndex].id);
      this.populateCalendarItems();
      this.changeItemColor("checkedin");
      this.toggleItemModal();
      this.$swal.fire({
        icon: 'success',
        title: 'Guest Checked In!',
        text: 'Thank you for checking in the guest.',
        confirmButtonText: 'OK'
      });
    },
    checkOutGuest() {
      this.$swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'Are you sure you want to check out this guest?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true
      }).then((result) => {
        // Check if user confirmed the cancellation
        if (result.isConfirmed) {
          // Perform reservation cancellation logic here
          this.bookings[this.itemIndex].status = "checkedout";
          this.bookings[this.itemIndex].actualCheckoutDate = new Date();
          this.reservation.status = "vacant";
          this.updateBookings(this.bookings[this.itemIndex].id);
          this.changeItemColor("checkedout");
          this.toggleItemModal();
          // Display success message using SweetAlert
          this.$swal.fire({
            icon: 'success',
            title: 'Guest Checked Out!',
            text: 'The guest has been checked out.',
            confirmButtonText: 'OK'
          });
        }
      });

    },
    //methods for calendar items
    periodChanged() {
      // range, eventSource) {
      // Demo does nothing with this information, just including the method to demonstrate how
      // you can listen for changes to the displayed range and react to them (by loading items, etc.)
      //console.log(eventSource)
      //console.log(range)
    },
    thisMonth(d, h, m) {
      const t = new Date()
      return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
    },
    onClickDay(d) {
      let today = new Date();
      if (d.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0)) {
        this.selectionStart = null
        this.selectionEnd = null
        this.message = `You clicked: ${d.toLocaleDateString()}`

        this.toggleItemModal();
        this.reservation.clientName = "";
        this.reservation.clientEmail = "";
        this.reservation.clientAddress = "";
        this.reservation.clientNationality = "";
        this.reservation.clientType = "";
        this.reservation.roomName = "";
        this.reservation.numGuests = "";
        this.reservation.clientPhone = "";
        this.reservation.checkinDate = d.toLocaleDateString('en-GB');
        this.reservation.checkoutDate = d.toLocaleDateString('en-GB');

        this.reservation.status = "vacant";
      }
    },
    onClickItem(e) {

      this.itemIndex = this.bookings.findIndex(
        o => o.itemID === e.id
      );
      this.reservation.clientName = this.bookings[this.itemIndex].name;
      this.reservation.clientEmail = this.bookings[this.itemIndex].clientemail;
      this.reservation.clientAddress = this.bookings[this.itemIndex].clientaddress;
      this.reservation.clientNationality = this.bookings[this.itemIndex].clientnationality;
      this.reservation.clientType = this.bookings[this.itemIndex].clientType;
      this.reservation.checkinDate = this.bookings[this.itemIndex].checkinDate;
      this.reservation.checkoutDate = this.bookings[this.itemIndex].checkoutDate;
      this.reservation.roomName = this.bookings[this.itemIndex].room_name;
      this.reservation.numGuests = this.bookings[this.itemIndex].numGuests;
      this.reservation.clientPhone = this.bookings[this.itemIndex].contactNumber;
      this.reservation.status = this.bookings[this.itemIndex].status;
      this.reservation.isPaid = this.bookings[this.itemIndex].isPaid;

      this.toggleItemModal();
    },
    setShowDate(d) {
      this.message = `Changing calendar view to ${d.toLocaleDateString()}`
      this.showDate = d
    },
    setSelection(dateRange) {
      this.selectionEnd = dateRange[1]
      this.selectionStart = dateRange[0]
    },
    finishSelection(dateRange) {
      const currentDate = new Date(); // get current date
      if (dateRange[0].setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) { // check if start date is before current date
        // prompt user to select a valid start date
        return;
      }
      this.setSelection(dateRange)
      this.message = `You selected: ${this.selectionStart.toLocaleDateString()} -${this.selectionEnd.toLocaleDateString()}`

      this.reservation.status = "vacant";
      this.reservation.clientName = "";
      this.reservation.clientEmail = "";
      this.reservation.clientAddress = "";
      this.reservation.clientNationality = "";
      this.reservation.clientType = "";
      this.reservation.roomName = "";
      this.reservation.roomPrice = "";
      this.reservation.roomType = "";
      this.reservation.roomPrice = "";
      this.reservation.numGuests = "";
      this.reservation.clientPhone = "";
      this.toggleItemModal();
      this.reservation.checkinDate = this.selectionStart.toLocaleDateString('en-GB');
      this.reservation.checkoutDate = this.selectionEnd.toLocaleDateString('en-GB');

    },
    onDrop(item, date) {

      const currentDate = new Date(); // get current date
      if (date.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) { // check if start date is before current date
        // prompt user to select a valid start date
        return;
      }

      this.itemIndex = this.bookings.findIndex(
        o => o.itemID === item.id
      );
      //issue in reloading

      const itemStatus = this.bookings[this.itemIndex].status;

      if (itemStatus === "reserved") {

        const eLength = CalendarMath.dayDiff(item.startDate, date)

        let landingDateCheckin = CalendarMath.addDays(item.startDate, eLength);
        let landingDateCheckout = CalendarMath.addDays(item.endDate, eLength);

        let filteredBookings = this.bookings.filter(booking => booking.itemID !== this.bookings[this.itemIndex].itemID && booking.room_name === this.bookings[this.itemIndex].room_name && new Date(booking.checkinDate.split('/')[2] + "-" + booking.checkinDate.split('/')[1] + "-" + booking.checkinDate.split('/')[0]).setHours(0, 0, 0, 0) <= landingDateCheckout.setHours(0, 0, 0, 0)
          && new Date(booking.checkoutDate.split('/')[2] + "-" + booking.checkoutDate.split('/')[1] + "-" + booking.checkoutDate.split('/')[0]).setHours(0, 0, 0, 0) >= landingDateCheckin.setHours(0, 0, 0, 0));

        if (filteredBookings.length === 0) {
          if (event.ctrlKey) {
            let sd = CalendarMath.addDays(item.startDate, 0)
            let ed = CalendarMath.addDays(item.endDate, eLength - CalendarMath.dayDiff(item.startDate, item.endDate))

            if (ed >= sd) {
              item.originalItem.startDate = sd
              item.originalItem.endDate = ed

            } else {
              item.originalItem.endDate = item.endDate
              item.originalItem.startDate = ed
            }

          } else {
            item.originalItem.startDate = CalendarMath.addDays(item.startDate, eLength)
            item.originalItem.endDate = CalendarMath.addDays(item.endDate, eLength)
          }


          this.bookings[this.itemIndex].checkinDate = item.originalItem.startDate.toLocaleDateString('en-GB');
          this.bookings[this.itemIndex].checkoutDate = item.originalItem.endDate.toLocaleDateString('en-GB');
          this.updateBookings(this.bookings[this.itemIndex].id);
          //this.reloadData();
          this.populateCalendarItems();
        } else {
          this.$swal.fire({
            icon: 'error',
            title: 'Cannot Adjust Reservation',
            text: 'Dates conflict with an existing room reservation.',
            confirmButtonText: 'OK'
          });
        }
      }
    },
    async updateBookings(pk) {
      try {
        const response = await axios.put(this.API_URL + `bookings/${pk}/`, {
          itemID: this.bookings[this.itemIndex].itemID,
          status: this.bookings[this.itemIndex].status,
          name: this.bookings[this.itemIndex].name,
          clientemail: this.bookings[this.itemIndex].clientemail,
          clientaddress: this.bookings[this.itemIndex].clientaddress,
          clientnationality: this.bookings[this.itemIndex].clientnationality,
          clientType: this.bookings[this.itemIndex].clientType,
          checkinDate: this.bookings[this.itemIndex].checkinDate,
          checkoutDate: this.bookings[this.itemIndex].checkoutDate,
          room_name: this.bookings[this.itemIndex].room_name,
          room_price: this.bookings[this.itemIndex].room_price,
          room_type: this.bookings[this.itemIndex].room_type,
          numGuests: this.bookings[this.itemIndex].numGuests,
          contactNumber: this.bookings[this.itemIndex].contactNumber,
          actualCheckoutDate: this.bookings[this.itemIndex].actualCheckoutDate,
          cancellationDate: this.bookings[this.itemIndex].cancellationDate,
          isPaid: this.bookings[this.itemIndex].isPaid,
          totalPrice: this.bookings[this.itemIndex].totalPrice,
          partialPayment: this.bookings[this.itemIndex].partialPayment,
          processedBy: this.userdata.fName + " " + this.userdata.lName
        });

      } catch (error) {
        console.log(error);



      }
    },
    populateCalendarItems() {
      this.calendarItems = this.bookings.map(booking => {
        const startDate = booking.checkinDate.split('/')[2] + "-" + booking.checkinDate.split('/')[1] + "-" + booking.checkinDate.split('/')[0];
        const endDate = booking.checkoutDate.split('/')[2] + "-" + booking.checkoutDate.split('/')[1] + "-" + booking.checkoutDate.split('/')[0];
        const title = `${booking.room_name}-${booking.name}<span style="display:none">~${booking.itemID}~</span>`;
        const id = booking.itemID;
        const tooltip = `${booking.room_name}-${booking.name}`;
        let classes = '';

        if (booking.status === 'reserved') {
          if (booking.isPaid === 'partial' || booking.isPaid === 'yes') {
            classes = ['custom-date-class-violet'];
          } else {
            classes = ['custom-date-class-red'];
          }

        } else if (booking.status === 'checkedin') {
          if (booking.isPaid === 'no' || booking.isPaid === '') {
            classes = ['custom-date-class-green'];
          } else if (booking.isPaid === 'partial') {
            classes = ['custom-date-class-blue'];
          } else {
            classes = ['custom-date-class-yellow'];
          }

        } else if (booking.status === 'cancelled') {
          classes = ['custom-date-class-gray'];
        } else if (booking.status === 'checkedout') {
          classes = ['custom-date-class-orange'];
        }

        return { startDate, endDate, title, id, classes, tooltip };
      });
    },
    async clickTestAddItem() {
      let randomString = '';

      while (randomString.length < 64) {
        randomString += Math.random().toString(36).substr(2, 36);
      }
      randomString = randomString.substr(0, 64);
      let id = "e" + this.bookings.length + randomString;
      let startDate = this.reservation.checkinDate.split('/')[2] + "-" + this.reservation.checkinDate.split('/')[1] + "-" + this.reservation.checkinDate.split('/')[0];
      let endDate = this.reservation.checkoutDate.split('/')[2] + "-" + this.reservation.checkoutDate.split('/')[1] + "-" + this.reservation.checkoutDate.split('/')[0];
      let title = this.reservation.roomName.name + "-" + this.reservation.clientName;

      try {


        const numDays = Math.ceil((
          new Date(this.reservation.checkoutDate.split('/')[2] + "-" + this.reservation.checkoutDate.split('/')[1] + "-" + this.reservation.checkoutDate.split('/')[0]).setHours(0, 0, 0, 0)
          -
          new Date(this.reservation.checkinDate.split('/')[2] + "-" + this.reservation.checkinDate.split('/')[1] + "-" + this.reservation.checkinDate.split('/')[0]).setHours(0, 0, 0, 0)
        ) / (1000 * 60 * 60 * 24));

        const roomPrice = (this.rooms.findIndex(o => o.name === this.reservation.roomName.name) !== -1) ? this.rooms[this.rooms.findIndex(o => o.name === this.reservation.roomName.name)].price : 0;
        const roomType = (this.rooms.findIndex(o => o.name === this.reservation.roomName.name) !== -1) ? this.rooms[this.rooms.findIndex(o => o.name === this.reservation.roomName.name)].type : '';

        const response = await axios.post(this.API_URL + "bookings/", {
          itemID: id,
          status: "reserved",
          name: this.reservation.clientName,
          clientemail: this.reservation.clientEmail,
          clientaddress: this.reservation.clientAddress,
          clientnationality: this.reservation.clientNationality,
          clientType: this.reservation.clientType,
          checkinDate: this.reservation.checkinDate,
          checkoutDate: this.reservation.checkoutDate,
          room_name: this.reservation.roomName.name,
          room_price: roomPrice,
          room_type: roomType,
          numGuests: this.reservation.numGuests,
          contactNumber: this.reservation.clientPhone,
          isPaid: 'no',
          created_at: new Date(),
          totalPrice: (numDays + 1) * parseFloat(roomPrice),
          partialPayment: 0,
          processedBy: this.userdata.fName + " " + this.userdata.lName
        });

        this.bookings.push({
          itemID: id,
          status: "reserved",
          name: this.reservation.clientName,
          clientemail: this.reservation.clientEmail,
          clientaddress: this.reservation.clientAddress,
          clientnationality: this.reservation.clientNationality,
          clienttype: this.reservation.clientType,
          checkinDate: this.reservation.checkinDate,
          checkoutDate: this.reservation.checkoutDate,
          room_name: this.reservation.roomName.name,
          room_price: (this.rooms.findIndex(o => o.name === this.reservation.roomName.name) !== -1) ? this.rooms[this.rooms.findIndex(o => o.name === this.reservation.roomName.name)].price : '',
          room_type: (this.rooms.findIndex(o => o.name === this.reservation.roomName.name) !== -1) ? this.rooms[this.rooms.findIndex(o => o.name === this.reservation.roomName.name)].type : '',
          numGuests: this.reservation.numGuests,
          contactNumber: this.reservation.clientPhone,
          processedBy: this.userdata.fName + " " + this.userdata.lName
        })

        this.reloadData();

        this.populateCalendarItems();

        this.toggleItemModal();
        this.reservation.clientName = "";
        this.reservation.clientEmail = "";
        this.reservation.clientAddress = "";
        this.reservation.clientNationality = "";
        this.reservation.clientType = "";
        this.reservation.checkinDate = "";
        this.reservation.checkoutDate = "";
        this.reservation.roomName = "";
        this.reservation.roomPrice = "";
        this.reservation.roomType = "";
        this.reservation.roomPrice = "";
        this.reservation.numGuests = "";
        this.reservation.clientPhone = "";
        this.walkinStatus = false;

        this.$swal.fire({
          title: "Success!",
          text: "Booking successful!",
          icon: "success",
        });


      } catch (error) {
        console.error(error);
        this.$swal.fire({
          title: "error",
          text: "There is an error!",
          icon: "error",
        });

      }

    },
    removeItem() {
      this.calendarItems = this.calendarItems.filter(
        o => o.id !== this.bookings[this.itemIndex].itemID
      );
      this.bookings = this.bookings.filter(
        o => o.itemID !== this.bookings[this.itemIndex].itemID
      );
    },
    async loadTransactionData() {
      try {
        const response = await axios.get(this.API_URL + 'transaction/');
        this.transactions = response.data;
      } catch (error) {
        console.error(error); // log any errors
        this.transactions = []; // return an empty array in case of errors
      }
    },
    async placeOrder() {

      if (parseFloat(this.cashAmount) > 0) {

        if (this.walkinStatus && parseFloat(this.cashAmount) < parseFloat(this.total)) {
          await this.$swal.fire({
            title: 'Error',
            text: 'There is no partial payment for walkin guests.',
            icon: 'error'
          });
          return false;
        }
        const confirmMessage = 'Are you sure you want to save this transaction?';
        const result = await this.$swal.fire({
          title: 'Confirmation',
          text: confirmMessage,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, save it!',
          cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {

          const countdownMessage = 'Transaction will be saved in <span id="countdown">5</span> seconds. Do you want to cancel?';
          let countdownResult;
          countdownResult = await this.$swal.fire({
            title: 'Please wait',
            html: countdownMessage,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm now',
            cancelButtonText: 'Cancel',
            didOpen: () => {
              const countdownEl = document.querySelector('#countdown');
              let count = 5;
              const timerId = setInterval(() => {
                countdownEl.textContent = count;
                count--;
                if (count < 0) {
                  clearInterval(timerId);
                  this.$swal.close();
                }
              }, 1000);
            }
          });

          if (!countdownResult.isConfirmed) {
            return;
          }

          let bookid = null;
          try {
            bookid = this.bookings[this.itemIndex].itemID;
          } catch (error) {
            bookid = "walkin";
          }

          try {
            let existingTransaction = {
              data: []
            };
            if (bookid !== "walkin") {
              existingTransaction = await axios.post(`${this.API_URL}transaction/filter/`, {
                columnName: 'bookingID',
                columnKey: bookid
              });
            }
            const payStatus = (parseFloat(this.total) - parseFloat(this.cashAmount)) <= 0 ? 'full' : 'partial';
            if (existingTransaction.data.length === 0) {
              // Create a new transaction if it doesn't exist yet
              const updatedcashamount = parseFloat(this.cashAmount) > parseFloat(this.total) ? parseFloat(this.total) : parseFloat(this.cashAmount);
              const transactionData = {
                clientname: this.billing.clientName,
                clientemail: this.billing.clientEmail,
                clientcontact: this.billing.clientPhone,
                clientaddress: this.billing.clientAddress,
                clientnationality: this.billing.clientNationality,
                clientType: this.billing.clientType,
                nonCashReference: this.nonCashReference,
                totalAmountToPay: parseFloat(this.total),
                paymentMethod: this.paymentMethod,
                cashAmountPay: updatedcashamount,
                balance: parseFloat(this.total) - updatedcashamount,
                payStatus: (parseFloat(this.total) - parseFloat(this.cashAmount)) <= 0 ? 'full' : 'partial',
                discountMode: this.discountMode,
                discountValue: this.discountValue,
                bookingID: bookid,
                processedBy: this.userdata.fName + " " + this.userdata.lName
              };

              await axios.post(`${this.API_URL}transaction/`, transactionData);
              if (bookid !== "walkin") {
                this.bookings[this.itemIndex].partialPayment = transactionData.cashAmountPay;
              }

            } else {
              // Update the transaction if it already exists

              const transaction = existingTransaction.data[0];
              const existingCashAmountPay = parseFloat(transaction.cashAmountPay);
              const newcashAmountPay = (existingCashAmountPay + parseFloat(this.cashAmount) < parseFloat(this.subtotal)) ? existingCashAmountPay + parseFloat(this.cashAmount) : parseFloat(this.subtotal);
              const newbalance = (existingCashAmountPay + parseFloat(this.cashAmount) < parseFloat(this.subtotal)) ? parseFloat(transaction.totalAmountToPay) - parseFloat(newcashAmountPay) : 0;
              const transactionData = {
                clientname: this.billing.clientName,
                clientemail: this.billing.clientEmail,
                clientcontact: this.billing.clientPhone,
                clientaddress: this.billing.clientAddress,
                clientnationality: this.billing.clientNationality,
                clientType: this.billing.clientType,
                totalAmountToPay: parseFloat(this.subtotal),
                paymentMethod: this.paymentMethod,
                nonCashReference: this.nonCashReference,
                cashAmountPay: newcashAmountPay,
                balance: newbalance,
                payStatus: payStatus,
                discountMode: this.discountMode,
                discountValue: this.discountValue,
                bookingID: bookid,
                processedBy: this.userdata.fName + " " + this.userdata.lName
              };
              await axios.put(`${this.API_URL}transaction/${existingTransaction.data[0].id}/`, transactionData);
              this.bookings[this.itemIndex].partialPayment = existingTransaction.data[0].totalAmountToPay - newbalance;
            }

            if (bookid !== "walkin") {
              if (payStatus === "partial") {
                this.bookings[this.itemIndex].isPaid = "partial";

              } else {
                this.bookings[this.itemIndex].isPaid = "yes";
              }

              this.updateBookings(this.bookings[this.itemIndex].id);
              this.reloadData();
              this.populateCalendarItems();
            }

            // Show a success message using SweetAlert
            await this.$swal.fire({
              title: 'Success',
              text: 'Transaction saved successfully!',
              icon: 'success'
            });
            this.walkinStatus = false;
            document.location.reload();
          } catch (error) {
            // Show an error message using SweetAlert
            await this.$swal.fire({
              title: 'Error',
              text: 'An error occurred while saving the transaction.',
              icon: 'error'
            });
            console.error(error);
          }
        }
      } else {
        await this.$swal.fire({
          title: 'Error',
          text: 'Invalid entry for cash tendered.', 
          icon: 'error'
        });
      }

    },
    printSection(idstring, pLength, pWidth) {
      const section = document.getElementById(idstring);
      const sectionHTML = section.outerHTML;
      const printBtn = '<div class="row no-print"><div class="col-md-12 text-right"><button class="btn btn-danger" onclick="window.print()">Print Now</button></div></div>';
      const footerSummary = `<p class="text-right">Total = ${this.filteredTransactionsTotal}</p><p class="text-right">Collectibles = ${this.filteredTransactionsBalance}</p>`;
      const bootstrapCSS = `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"><style>.highlight {background-color: yellow;}body {font-family: Arial, sans-serif;line-height: 0.5;padding: 0.5in;}table {margin-top: 0.5in;margin-bottom: 0.5in;}.container {width: ${pWidth}px;height: ${pLength}px;padding-top: 0.25in;padding-bottom: 0.25in;background-color: #fff;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);margin: auto;}.text-center {text-align: center;}.text-right {text-align: right;}@media print {.no-print {display: none;}html, body {width: ${pWidth}px;height: ${pLength}px;margin: 0;padding: 0;}}</style>`;
      const bootstrapJS = '<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"><script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js">';
      const html = `<!doctype html><html><head>${bootstrapCSS}</head><body>${printBtn}${sectionHTML}${footerSummary}${bootstrapJS}</body></html>`;
      // Create a new jsPDF instance


      const options = "height=500,width=800,scrollbars=no,status=no,toolbar=no,location=no";
      const newWindow = window.open("", "_blank", options);
      newWindow.document.write(html);

    },
    generateBillingStatement() {
      this.printSection('billing-details', 1300, 850);
    },
    printReservationHistory() {
      this.printSection('reservationHistory', 850, 1300);
    },
    printTransactionHistory() {
      this.printSection('transactionHistory', 850, 1300);
    },
    async reloadItemsData() {
      try {
        const response = await axios.get(this.API_URL + "leisures/");
        this.items = response.data.filter(item => item.isAvailable === true);
      } catch (error) {
        console.log(error);
      }
    },
    async reloadData() {
      try {
        const roomsResponse = await axios.get(this.API_URL + "rooms/");
        this.rooms = roomsResponse.data.filter(item => item.isAvailable === true);

        /*
this.bookings.filter(booking => booking.room_name === this.bookings[this.itemIndex].room_name );
        */

        const reservationsResponse = await axios.get(this.API_URL + "bookings/");
        this.bookings = reservationsResponse.data;
        this.populateCalendarItems()
      } catch (error) {
        console.log(error);
      }
    },
    vacantRoom(roomNumber) {
      const bookingIndex = this.reservations.findIndex(
        reservation =>
          reservation.room_name === roomNumber &&
          new Date(reservation.checkinDate) < new Date() &&
          new Date(reservation.checkoutDate) > new Date()
      );
      return bookingIndex === -1;
    },
    isItemAvailableInCart(item) {
      const itemIndex = this.cart.findIndex(
        o =>
          o.name === item
      );
      return itemIndex === -1;

    },
    isRoomAvailable(room, checkinDate, checkoutDate) {
      // Get all reservations for the given room
      const roomReservations = this.bookings.filter(reservation => reservation.room_name === room);
      // Check if the room is available for the given date range
      for (let i = 0; i < roomReservations.length; i++) {
        const reservation = roomReservations[i];
        if (
          checkinDate < new Date(reservation.checkoutDate) &&
          checkoutDate > new Date(reservation.checkinDate)
        ) {
          return false; // Room is not available
        }
      }
      return true; // Room is available
    },
    async addToCart(item, index) {
      if (this.billing.clientName !== "") {
        if (this.isItemAvailableInCart(item.item)) {
          if (this.howMany[index] > 0) {
            this.itemCart.name = item.item;
            this.itemCart.type = item.type;
            this.itemCart.rate = item.rate;
            this.itemCart.counter = item.counter;
            this.itemCart.priceRate = item.priceRate + "/" + item.counter;
            this.itemCart.purqty = this.howMany[index];
            this.itemCart.category = "inclusion";
            this.itemCart.itemOption = "addons";
            this.itemCart.totalCartPrice = parseFloat(item.priceRate) * parseFloat(this.howMany[index]);
            this.$swal.fire({
              title: "Success!",
              text: "Added to cart!",
              icon: "success",
            });
            // Define the data to be sent to the API
            const data = {

              itemName: this.itemCart.name,
              itemType: this.itemCart.type,
              itemPriceRate: this.itemCart.priceRate,
              purchaseQty: this.itemCart.purqty,
              totalCost: this.itemCart.totalCartPrice,
              category: this.itemCart.category,
              itemOption: this.itemCart.itemOption,
              dateCreated: new Date(), // Set the dateCreated field to the current date and time
            };

            try {
              // Access property here
              data.bookingID = this.bookings[this.itemIndex].itemID;
              // Make a POST request to the API to save the data
              await axios.post(this.API_URL + 'transaction/item/', data)
                .then(response => {
                  // Log a success message to the console
                  this.itemCart.id = response.data.id;
                })
                .catch(error => {
                  // Log an error message to the console
                  console.error('Error saving data:', error);
                });
            } catch (e) {
              // Handle the error here
              data.bookingID = "walkin";
            }
            console.log(this.itemCart)
            this.cart.push(this.itemCart);
            this.howMany[index] = '';
            this.itemCart = {
              id: 0,
              name: "",
              priceRate: "",
              rate: "",
              counter: "",
              purqty: "",
              totalCartPrice: "",
              category: ""
            }
          } else {
            this.$swal.fire({
              title: "Error!",
              text: "Invalid entry for quantity.",
              icon: "error",
            });
          }

        } else {
          this.$swal.fire({
            title: "Error!",
            text: "Item is already in the cart.",
            icon: "error",
          });
        }
      } else {
        this.$swal.fire({
          title: "Error!",
          text: "Supply first client's info.",
          icon: "error",
        }).then((result) => {
          this.howMany[index] = '';
          this.toggleAddAccountModal();
        });
      }
    },
    cancelItem(item) {

      this.$swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.cart = this.cart.filter(
            o => o.id !== item.id
          );
          if (this.itemIndex !== -1) {
            axios.get(this.API_URL + `transaction/item/delete/${item.id}/`)
              .then(response => {
                this.$swal.fire(
                  'Deleted!',
                  'Your item has been deleted.',
                  'success'
                )
                // perform any additional operations after successful delete
              })
              .catch(error => {
                console.log(error)
                this.$swal.fire(
                  'Error!',
                  'Failed to delete item.',
                  'error'
                )
              })
          }
        }
      })

    },
    async bookRoom(room) {

      const checkinDate = new Date(this.reservation.checkinDate);
      const checkoutDate = new Date(this.reservation.checkoutDate);
      const numDays = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
      if (this.isRoomAvailable(this.choice_room, checkinDate, checkoutDate)) {
        this.reservation.name = this.clientName;
        this.reservation.contactNumber = this.clientPhone;
        this.reservation.room_name = this.choice_room.name;
        this.reservation.room_price = this.choice_room.price;
        this.reservation.room_type = this.choice_room.type;
        this.reservation.totalPrice = this.reservation.room_price * numDays;
        try {

          const response = await axios.post(this.API_URL + "bookings/", {
            name: this.reservation.name,
            checkinDate: this.reservation.checkinDate,
            checkoutDate: this.reservation.checkoutDate,
            room_name: this.reservation.room_name,
            room_type: this.reservation.room_type,
            room_price: this.reservation.room_price,
            numGuests: this.reservation.numGuests,
            contactNumber: this.reservation.contactNumber,
            totalPrice: this.reservation.totalPrice
          });

          this.reservations.push(this.reservation);
          this.reloadData();
          this.reservation = {
            name: "",
            room_name: "",
            room_type: "",
            room_price: "",
            contactNumber: "",
            totalPrice: 0
          };

          this.$swal.fire({
            title: "Success!",
            text: "Booking successful!",
            icon: "success",
          });


        } catch (error) {
          console.error(error);

          this.$swal.fire({
            title: "Error!",
            text: "An error occurred while booking the room.",
            icon: "error",
          });

        }
      } else {

        this.$swal.fire({
          title: "Error!",
          text: "Sorry, the room is already occupied.",
          icon: "error",
        });

      }
    },
    printReservation(reservation) {
      const doc = new jsPDF();
      const content = `Booking Slip
      ----------------
      Name: <b>${reservation.name}</b>
      Room: ${reservation.room_name}
      Check-in: ${reservation.checkinDate}
      Check-out: ${reservation.checkoutDate}
      Guests: ${reservation.numGuests}
      Contact: ${reservation.contactNumber}`;
      doc.text(content, 10, 10);
      doc.save(`Booking Slip - ${reservation.name}.pdf`);
    },
    handleContextMenu(event) {
      event.preventDefault();
      if (event.target.classList.contains('cv-item')) {
        //this.$refs.vueSimpleContextMenu1.showMenu(event, event.target.innerHTML);
      } else if (event.target.classList.contains('cv-day')) {
        const item = event.target.outerHTML.toString()
        const strDate = item.split(" ")[4].replace('d', '');
        const strDateDay = strDate.split("-")[2];
        const strDateMos = strDate.split("-")[1];
        const strDateYer = strDate.split("-")[0];
        const convDate = strDateDay + "/" + strDateMos + "/" + strDateYer
        this.convDate = convDate;
        this.toggleShowAllModal();

      }
    },
  },
  mounted() {
    this.newItemStartDate = CalendarMath.isoYearMonthDay(CalendarMath.today())
    this.newItemEndDate = CalendarMath.isoYearMonthDay(CalendarMath.today())
    this.$nextTick(() => {
      document.body.addEventListener('contextmenu', this.handleContextMenu);
    });
  }
};
</script>
<style>
@import "vue-select/dist/vue-select.css";

img {
  max-width: 100%;
  height: auto;
}

.wrapper-content {
  max-height: 450px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 1px;
}

.wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.item-count,
.total-price {
  font-weight: bold;
}

.cart-button button {
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer;
}

.cart-button a {
  text-decoration: none;
  font-weight: bold;
}

.contents-left {
  display: flex;
  justify-content: flex-end;
}

#billing-details {
  display: none;
}

@media screen and (max-width: 767px) {
  .modal-dialog-sidebar {
    max-width: 100%;
  }
}

.cv-item.custom-date-class-gray {
  background-color: rgb(219, 212, 212);
  color: rgb(37, 36, 35);
}

.cv-item.custom-date-class-orange {
  background-color: rgb(240, 169, 18);
  color: antiquewhite;
}

.cv-item.custom-date-class-blue {
  background-color: rgb(11, 14, 214);
  color: antiquewhite;
}

.cv-item.custom-date-class-violet {
  background-color: rgb(219, 13, 175);
  color: antiquewhite;
}

.cv-item.custom-date-class-red {
  background-color: #f66;
  color: antiquewhite;
}

.cv-item.custom-date-class-green {
  background-color: #0b9d17;
  color: antiquewhite;
}

.cv-item.custom-date-class-yellow {
  background-color: #bce40c;
  color: antiquewhite;
}

.rotated-text {
  writing-mode: vertical-lr;
  /* For modern browsers */
  transform: rotate(180deg);
  /* For older browsers */
}
</style>
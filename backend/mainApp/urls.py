from django.urls import re_path
from .views import login, users_list, user_delete, users_filter, booking_list, room_list, rooms_filter, room_delete, booking_delete, leisure_list, leisure_filter, transaction_list, transactionitem_list, booking_status_counts, transaction_filter, transactionitem_filter, transactionitem_delete

urlpatterns = [
    re_path(r'^login/$', login, name='login'),
    re_path(r'^users/$',users_list , name='users-list'),
    re_path(r'^users/(?P<pk>\d+)/$',users_list, name='users-detail'), 
    re_path(r'^users/filter/$', users_filter, name='users-filter'),
    re_path(r'^user/delete/(?P<pk>\d+)/$', user_delete, name='user-delete'), 
    re_path(r'^bookings/$',booking_list , name='booking-list'),
    re_path(r'^bookings/stats/$', booking_status_counts, name='booking-stats'),
    re_path(r'^bookings/(?P<pk>\d+)/$', booking_list, name='booking-detail'), 
    re_path(r'^bookings/delete/(?P<pk>\d+)/$', booking_delete, name='booking-delete'),    
    re_path(r'^rooms/$', room_list, name='room-list'),
    re_path(r'^rooms/(?P<pk>\d+)/$', room_list, name='room-detail'), 
    re_path(r'^rooms/filter/$', rooms_filter, name='rooms-filter'),
    re_path(r'^rooms/delete/(?P<pk>\d+)/$', room_delete, name='room-delete'), 
    re_path(r'^leisures/$', leisure_list, name='leisure-list'),
    re_path(r'^leisures/(?P<pk>\d+)/$',leisure_list, name='leisure-detail'), 
    re_path(r'^leisures/filter/$', leisure_filter, name='leisure-filter'),
    re_path(r'^transaction/$', transaction_list, name='transaction-list'),
    re_path(r'^transaction/(?P<pk>\d+)/$', transaction_list, name='transaction-detail'), 
    re_path(r'^transaction/filter/$', transaction_filter, name='transaction-filter'),
    re_path(r'^transaction/item/$', transactionitem_list, name='transactionItem-list'),
    re_path(r'^transaction/item/(?P<pk>\d+)/$', transactionitem_list, name='transactionItem-detail'),
    re_path(r'^transaction/item/delete/(?P<pk>\d+)/$', transactionitem_delete, name='transactionItem-delete'),
    re_path(r'^transaction/item/filter/$', transactionitem_filter, name='transactionItem-list'),
]

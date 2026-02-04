/*
  BLAS wrapper for Ruby/Numo
    (C) Copyright 2017 by Masahiro TANAKA

  This program is free software.
  NO WARRANTY.
*/

#include <assert.h>
#include <ruby.h>
#include "numo/narray.h"
#include "numo/template.h"
#include "numo_blas.h"

<% id_decl.each do |x| %>
<%= x %>
<% end %>

<% include_files.each do |f| %>
#include <<%=f%>>
<% end %>

<% children.each do |c|%>
<%= c.result+"\n\n" %>
<% end %>

void
Init_<%=lib_name%>(void)
{
    VALUE <%=ns_var%>;

    <%=ns_var%> = rb_define_module("Numo");

    <% id_assign.each do |x| %>
    <%= x %><% end %>

<% children.each do |c| %>
<%= c.init_def %>
<% end %>
}
